import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";

// Shared state between test and mock for save/load tests
const mockGridLayout = vi.hoisted(() => ({
    onLayoutChange: null as ((layout: any) => void) | null,
    layout: null as any,
}));

// Mock react-grid-layout to avoid ResizeObserver/offsetWidth issues in jsdom
vi.mock("react-grid-layout", () => ({
    ReactGridLayout: ({ children, layout, onLayoutChange }: any) => {
        mockGridLayout.onLayoutChange = onLayoutChange || null;
        mockGridLayout.layout = layout;
        return <div data-testid="grid-layout">{children}</div>;
    },
    useContainerWidth: () => ({
        width: 1200,
        containerRef: { current: null },
        mounted: true,
    }),
}));

import GridContainer from "../../src/components/GridContainer";
import { useWidgetsStore, loadLayout } from "../../src/store/WidgetsStore";
import modService from "../../src/services/modService";

// reload layout from current localStorage — used to init/reset store
function initLayout() {
    useWidgetsStore.setState({
        layout: loadLayout(modService.listOfWidgets),
        isEditMode: false,
    });
}

function render(ui: React.ReactElement) {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => root.render(ui));
    return {
        container,
        unmount: () => act(() => root.unmount()),
    };
}

describe("GridContainer", () => {
    beforeEach(() => {
        vi.spyOn(console, "log").mockImplementation(() => {});
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should render the grid layout container", () => {
        const { container, unmount } = render(<GridContainer />);
        try {
            const grid = container.querySelector('[data-testid="grid-layout"]');
            expect(grid).toBeTruthy();
        } finally {
            unmount();
        }
    });

    describe("cover div in edit mode", () => {
        beforeEach(() => {
            useWidgetsStore.setState({ isEditMode: false });
        });

        it("should not render .cover when edit mode is off", () => {
            const { container, unmount } = render(<GridContainer />);
            try {
                expect(container.querySelectorAll(".cover")).toHaveLength(0);
            } finally {
                unmount();
            }
        });

        it("should render .cover on each widget except Edit grid buttom when edit mode is on", () => {
            const { container, unmount } = render(<GridContainer />);
            try {
                const btn = container.querySelector("button")!;
                act(() => { btn.click(); });
                expect(container.querySelectorAll(".cover")).toHaveLength(2);
            } finally {
                unmount();
            }
        });

        it("should remove .cover when edit mode is toggled off", () => {
            const { container, unmount } = render(<GridContainer />);
            try {
                const btn = container.querySelector("button")!;
                act(() => { btn.click(); }); // on
                expect(container.querySelectorAll(".cover")).toHaveLength(2);
                act(() => { btn.click(); }); // off
                expect(container.querySelectorAll(".cover")).toHaveLength(0);
            } finally {
                unmount();
            }
        });
    });

    describe("save/load of grid layout", () => {
        beforeEach(() => {
            localStorage.clear();
            initLayout();
        });

        const DEFAULT_LAYOUT = [
            {
                i: "Edit grid buttom", x: 0, y: 0, w: 1, h: 1,
                minW: 1, minH: 1, maxW: 1, maxH: 1,
            },
            {
                i: "Playlist selector", x: 0, y: 1, w: 3, h: 1,
                minW: 3, minH: 1, maxW: 6, maxH: 2,
            },
            {
                i: "Test Widget 1", x: 0, y: 2, w: 1, h: 1,
                minW: 1, minH: 1, maxW: 10, maxH: 10,
            },
        ];

        it("loads default layout when nothing saved in localStorage", () => {
            const { unmount } = render(<GridContainer />);
            try {
                expect(mockGridLayout.layout).toEqual(DEFAULT_LAYOUT);
            } finally {
                unmount();
            }
        });

        it("loads saved layout from localStorage", () => {
            const saved = [
                { i: "Edit grid buttom", x: 2, y: 0, w: 1, h: 1 },
                { i: "Playlist selector", x: 0, y: 1, w: 4, h: 2 },
                { i: "Test Widget 1", x: 0, y: 0, w: 2, h: 2 },
            ];
            // Store in persist-middleware format: { state: { ... }, version: 0 }
            localStorage.setItem("grid-layout", JSON.stringify({
                state: { isEditMode: false, layout: saved },
                version: 0,
            }));
            // Simulate rehydration: read persist format and apply to store
            const persistData = JSON.parse(localStorage.getItem("grid-layout")!);
            useWidgetsStore.setState({ layout: persistData.state.layout, isEditMode: persistData.state.isEditMode });

            const { unmount } = render(<GridContainer />);
            try {
                // min/max come from widget definitions, not stored layout
                expect(mockGridLayout.layout).toEqual(saved);
            } finally {
                unmount();
            }
        });

        it("saves layout to localStorage when layout changes", () => {
            const { unmount } = render(<GridContainer />);
            try {
                const newLayout = [
                    { i: "Edit grid buttom", x: 3, y: 0, w: 1, h: 1 },
                    { i: "Test Widget 1", x: 0, y: 1, w: 4, h: 3 },
                    { i: "Playlist selector", x: 0, y: 0, w: 3, h: 1 },
                ];
                act(() => { mockGridLayout.onLayoutChange!(newLayout); });
                const stored = JSON.parse(localStorage.getItem("grid-layout")!);
                expect(stored).toEqual({
                    state: { isEditMode: false, layout: newLayout },
                    version: 0,
                });
            } finally {
                unmount();
            }
        });

        it("ignores corrupt localStorage and falls back to default layout", () => {
            localStorage.setItem("grid-layout", "not-valid-json");
            initLayout();
            const { unmount } = render(<GridContainer />);
            try {
                expect(mockGridLayout.layout).toEqual(DEFAULT_LAYOUT);
            } finally {
                unmount();
            }
        });
    });
});

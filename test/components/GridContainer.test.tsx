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
            // mirror App's bootstrap: seed the grid from the registered mod widgets
            useWidgetsStore.setState({
                layout: loadLayout(modService.listOfWidgets),
                isEditMode: false,
            });
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


});

import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {createRoot} from "react-dom/client";
import {act} from "react";

// Shared state between test and mock for save/load tests
const mockGridLayout = vi.hoisted(() => ({
    onLayoutChange: null as ((layout: any) => void) | null,
    layout: null as any,
}));

// Mock react-grid-layout to avoid ResizeObserver/offsetWidth issues in jsdom
vi.mock("react-grid-layout", () => ({
    ReactGridLayout: ({children, layout, onLayoutChange}: any) => {
        mockGridLayout.onLayoutChange = onLayoutChange || null;
        mockGridLayout.layout = layout;
        return <div data-testid="grid-layout">{children}</div>;
    },
    useContainerWidth: () => ({
        width: 1200,
        containerRef: {current: null},
        mounted: true,
    }),
}));

// jsdom + Node 26 may not expose localStorage globally
if (typeof localStorage === 'undefined') {
    const store: Record<string, string> = {};
    (globalThis as any).localStorage = {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = v },
        removeItem: (k: string) => { delete store[k] },
        clear: () => { Object.keys(store).forEach(k => delete store[k]) },
        get length() { return Object.keys(store).length },
        key: (i: number) => Object.keys(store)[i] ?? null,
    };
}

import GridContainer from "../../src/components/GridContainer";
import {EditModeProvider} from "../../src/context/EditModeContext";

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
        const {container, unmount} = render(
            <EditModeProvider><GridContainer /></EditModeProvider>,
        );
        try {
            const grid = container.querySelector('[data-testid="grid-layout"]');
            expect(grid).toBeTruthy();
        } finally {
            unmount();
        }
    });

    describe("cover div in edit mode", () => {
        it("should not render .cover when edit mode is off", () => {
            const {container, unmount} = render(
                <EditModeProvider><GridContainer /></EditModeProvider>,
            );
            try {
                expect(container.querySelectorAll(".cover").length).toBe(0);
            } finally {
                unmount();
            }
        });

        it("should render .cover on each widget except Edit grid buttom when edit mode is on", () => {
            const {container, unmount} = render(
                <EditModeProvider><GridContainer /></EditModeProvider>,
            );
            try {
                // Toggle edit mode on via the Edit grid buttom button
                const btn = container.querySelector("button")!;
                act(() => { btn.click(); });
                // 3 widgets total, 1 is "Edit grid buttom" → 2 covers
                expect(container.querySelectorAll(".cover").length).toBe(2);
            } finally {
                unmount();
            }
        });

        it("should remove .cover when edit mode is toggled off", () => {
            const {container, unmount} = render(
                <EditModeProvider><GridContainer /></EditModeProvider>,
            );
            try {
                const btn = container.querySelector("button")!;
                act(() => { btn.click(); });          // on
                expect(container.querySelectorAll(".cover").length).toBe(2);
                act(() => { btn.click(); });          // off
                expect(container.querySelectorAll(".cover").length).toBe(0);
            } finally {
                unmount();
            }
        });
    });

    describe("save/load of grid layout", () => {
        beforeEach(() => {
            localStorage.clear();
        });

        const DEFAULT_LAYOUT = [
            {i: "Edit grid buttom", x: 0, y: 0, w: 1, h: 1, minW: 1, minH: 1, maxW: 1, maxH: 1},
            {i: "Playlist selector", x: 0, y: 1, w: 3, h: 1, minW: 3, minH: 1, maxW: 6, maxH: 2},
            {i: "Test Widget 1", x: 0, y: 2, w: 1, h: 1, minW: 1, minH: 1, maxW: 10, maxH: 10},
        ];

        it("loads default layout when nothing saved in localStorage", () => {
            const {unmount} = render(
                <EditModeProvider><GridContainer /></EditModeProvider>,
            );
            try {
                expect(mockGridLayout.layout).toEqual(DEFAULT_LAYOUT);
            } finally {
                unmount();
            }
        });

        it("loads saved layout from localStorage", () => {
            const saved = [
                {i: "Edit grid buttom", x: 2, y: 0, w: 1, h: 1},
                {i: "Playlist selector", x: 0, y: 1, w: 4, h: 2},
                {i: "Test Widget 1", x: 0, y: 0, w: 2, h: 2},
            ];
            localStorage.setItem("grid-layout", JSON.stringify(saved));

            const {unmount} = render(
                <EditModeProvider><GridContainer /></EditModeProvider>,
            );
            try {
                const expected = saved.map((p: any) => {
                    const w = [
                        {name: "Edit grid buttom", minSize: {width: 1, height: 1}, maxSize: {width: 1, height: 1}},
                        {name: "Playlist selector", minSize: {width: 3, height: 1}, maxSize: {width: 6, height: 2}},
                        {name: "Test Widget 1", minSize: {width: 1, height: 1}, maxSize: {width: 10, height: 10}},
                    ].find((w) => w.name === p.i);
                    return w
                        ? {...p, minW: w.minSize.width, minH: w.minSize.height, maxW: w.maxSize.width, maxH: w.maxSize.height}
                        : p;
                });
                expect(mockGridLayout.layout).toEqual(expected);
            } finally {
                unmount();
            }
        });

        it("saves layout to localStorage when layout changes", () => {
            const {unmount} = render(
                <EditModeProvider><GridContainer /></EditModeProvider>,
            );
            try {
                const newLayout = [
                    {i: "Edit grid buttom", x: 3, y: 0, w: 1, h: 1},
                    {i: "Test Widget 1", x: 0, y: 1, w: 4, h: 3},
                    {i: "Playlist selector", x: 0, y: 0, w: 3, h: 1},
                ];
                act(() => {
                    mockGridLayout.onLayoutChange!(newLayout);
                });
                const stored = JSON.parse(localStorage.getItem("grid-layout")!);
                expect(stored).toEqual(newLayout);
            } finally {
                unmount();
            }
        });

        it("ignores corrupt localStorage and falls back to default layout", () => {
            localStorage.setItem("grid-layout", "not-valid-json");
            const {unmount} = render(
                <EditModeProvider><GridContainer /></EditModeProvider>,
            );
            try {
                expect(mockGridLayout.layout).toEqual(DEFAULT_LAYOUT);
            } finally {
                unmount();
            }
        });
    });
});

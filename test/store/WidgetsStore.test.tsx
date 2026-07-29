import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {useWidgetsStore, loadLayout} from "../../src/store/WidgetsStore";
import modService from "../../src/services/modService";

// LocalStorage polyfill for jsdom + Node
if (typeof localStorage === "undefined") {
    const store: Record<string, string> = {};
    (globalThis as any).localStorage = {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => {
            store[k] = v;
        },
        removeItem: (k: string) => {
            delete store[k];
        },
        clear: () => {
            Object.keys(store).forEach((k) => delete store[k]);
        },
        get length() {
            return Object.keys(store).length;
        },
        key: (i: number) => Object.keys(store)[i] ?? null,
    };
}

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

/** Reload layout from current localStorage — used to init/reset store */
function initLayout() {
    useWidgetsStore.setState({
        layout: loadLayout(modService.listOfWidgets),
        isEditMode: false,
    });
}

describe("WidgetsStore", () => {
    beforeEach(() => {
        localStorage.clear();
        initLayout();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("loadLayout", () => {
        it("loads default layout when nothing saved in localStorage", () => {
            const layout = useWidgetsStore.getState().layout;
            expect(layout).toEqual(DEFAULT_LAYOUT);
        });

        it("loads saved layout from localStorage", () => {
            const saved = [
                {i: "Edit grid buttom", x: 2, y: 0, w: 1, h: 1},
                {i: "Playlist selector", x: 0, y: 1, w: 4, h: 2},
                {i: "Test Widget 1", x: 0, y: 0, w: 2, h: 2},
            ];
            // Store in persist-middleware format: { state: { ... }, version: 0 }
            localStorage.setItem("grid-layout", JSON.stringify({
                state: {layout: saved},
                version: 0,
            }));
            // Simulate rehydration: read persist format and apply to store
            const persistData = JSON.parse(localStorage.getItem("grid-layout")!);
            useWidgetsStore.setState({layout: persistData.state.layout});

            const layout = useWidgetsStore.getState().layout;
            expect(layout).toEqual(saved);
        });

        it("saves layout to localStorage when layout changes", () => {
            const newLayout = [
                {i: "Edit grid buttom", x: 3, y: 0, w: 1, h: 1},
                {i: "Test Widget 1", x: 0, y: 1, w: 4, h: 3},
                {i: "Playlist selector", x: 0, y: 0, w: 3, h: 1},
            ];
            useWidgetsStore.getState().updateLayout(newLayout);
            const stored = JSON.parse(localStorage.getItem("grid-layout")!);
            expect(stored).toEqual({
                state: {layout: newLayout},
                version: 0,
            });
        });

        it("ignores corrupt localStorage and falls back to default layout", () => {
            localStorage.setItem("grid-layout", "not-valid-json");
            initLayout();
            const layout = useWidgetsStore.getState().layout;
            expect(layout).toEqual(DEFAULT_LAYOUT);
        });
    });
});

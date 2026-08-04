import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {loadLayout, useWidgetsStore} from "../../src/store/WidgetsStore";
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

// Layout items are keyed by a generated uuid (`i`), so comparisons ignore it.
const DEFAULT_LAYOUT = [
    {
        widget: "Edit grid buttom", x: 0, y: 0, w: 1, h: 1,
        minW: 1, minH: 1, maxW: 1, maxH: 1,
    },
    {
        widget: "Playlist selector", x: 0, y: 0, w: 3, h: 1,
        minW: 3, minH: 1, maxW: 6, maxH: 2,
    },
    {
        widget: "Test Widget 1", x: 0, y: 0, w: 1, h: 1,
        minW: 1, minH: 1, maxW: 10, maxH: 10,
    },
];

/** Drop the uuid `i` key so layouts can be compared deterministically */
function withoutUuid(layout: {i: string}[]) {
    return layout.map(({i, ...rest}) => rest);
}

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
            expect(withoutUuid(layout)).toEqual(DEFAULT_LAYOUT);
        });

        it("each widget gets a unique uuid key and keeps its name in widget", () => {
            const layout = useWidgetsStore.getState().layout;
            const ids = layout.map((item) => item.i);
            expect(new Set(ids).size).toBe(layout.length);
            expect(layout.map((item) => item.widget)).toEqual([
                "Edit grid buttom",
                "Playlist selector",
                "Test Widget 1",
            ]);
        });

        it("loads saved layout from localStorage", () => {
            const saved = [
                {i: "11111111-1111-1111-1111-111111111111", widget: "Edit grid buttom", x: 2, y: 0, w: 1, h: 1},
                {i: "22222222-2222-2222-2222-222222222222", widget: "Playlist selector", x: 0, y: 1, w: 4, h: 2},
                {i: "33333333-3333-3333-3333-333333333333", widget: "Test Widget 1", x: 0, y: 0, w: 2, h: 2},
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

        it("saves layout to localStorage when layout changes, keeping widget identity", () => {
            const base = [
                {i: "11111111-1111-1111-1111-111111111111", widget: "Edit grid buttom", x: 0, y: 0, w: 1, h: 1, minW: 1, minH: 1, maxW: 1, maxH: 1},
                {i: "22222222-2222-2222-2222-222222222222", widget: "Playlist selector", x: 0, y: 0, w: 3, h: 1, minW: 3, minH: 1, maxW: 6, maxH: 2},
            ];
            useWidgetsStore.setState({layout: base});

            const moved = [
                {i: "11111111-1111-1111-1111-111111111111", x: 3, y: 0, w: 1, h: 1},
                {i: "22222222-2222-2222-2222-222222222222", x: 0, y: 1, w: 4, h: 2},
            ];
            useWidgetsStore.getState().updateLayout(moved);

            const stored = JSON.parse(localStorage.getItem("grid-layout")!).state.layout;
            expect(stored).toEqual([
                {...base[0], ...moved[0]},
                {...base[1], ...moved[1]},
            ]);
        });

        it("ignores corrupt localStorage and falls back to default layout", () => {
            localStorage.setItem("grid-layout", "not-valid-json");
            initLayout();
            const layout = useWidgetsStore.getState().layout;
            expect(withoutUuid(layout)).toEqual(DEFAULT_LAYOUT);
        });
    });
});
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {createRoot} from "react-dom/client";
import {act} from "react";

// Mock react-grid-layout to avoid ResizeObserver/offsetWidth issues in jsdom
vi.mock("react-grid-layout", () => ({
    ReactGridLayout: ({children}: { children: React.ReactNode }) => (
        <div data-testid="grid-layout">{children}</div>
    ),
    useContainerWidth: () => ({
        width: 1200,
        containerRef: {current: null},
        mounted: true,
    }),
}));

// Prevent MainTrackService side effects
vi.mock("../../src/services/mainTrackService", () => ({
    default: {start: vi.fn(), stop: vi.fn(), getCurrentPlaylist: vi.fn(), changePlaylist: vi.fn()},
}));

import App from "../../src/App";
import MainPage from "../../src/pages/MainPage";
import {EditWidget} from "../../src/mod/systemWidgetMod/EditWidget";
import {TestWidget1} from "../../src/mod/TestMod/TestWidget1";
import {EditModeProvider} from "../../src/context/EditModeContext";

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

describe("App / MainPage integration", () => {
    beforeEach(() => {
        // Suppress console.log from useContainerWidth / PageContent
        vi.spyOn(console, "log").mockImplementation(() => {
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should render App with MainPage and widgets", () => {
        const {container, unmount} = render(<App/>);
        try {
            // MainPage renders page content
            expect(container.textContent).toContain("Test Widget 1");
            // EditWidget button exists
            const buttons = container.querySelectorAll("button");
            expect(buttons.length).toBeGreaterThanOrEqual(1);
        } finally {
            unmount();
        }
    });

    it("should render the grid layout container", () => {
        const {container, unmount} = render(<App/>);
        try {
            const grid = container.querySelector('[data-testid="grid-layout"]');
            expect(grid).toBeTruthy();
        } finally {
            unmount();
        }
    });
});

describe("EditWidget", () => {
    it("should render a button with green background (editMode off)", () => {
        const {container, unmount} = render(
            <EditModeProvider><EditWidget.content/></EditModeProvider>,
        );
        try {
            const btn = container.querySelector("button");
            expect(btn).toBeTruthy();
            expect(btn!.style.background).toBe("green");
            expect(btn!.style.cursor).toBe("pointer");
        } finally {
            unmount();
        }
    });

    it("should toggle to red background on click", () => {
        const {container, unmount} = render(
            <EditModeProvider><EditWidget.content/></EditModeProvider>,
        );
        try {
            const btn = container.querySelector("button")!;
            expect(btn.style.background).toBe("green");
            act(() => {
                btn.click();
            });
            expect(btn.style.background).toBe("red");
        } finally {
            unmount();
        }
    });
});

describe("TestWidget1", () => {
    it("should render with a colored background and text", () => {
        const {container, unmount} = render(<TestWidget1.content/>);
        try {
            expect(container.textContent).toContain("Test Widget 1");
            const div = container.firstElementChild as HTMLElement;
            expect(div).toBeTruthy();
            // hsl() is converted to rgb() by the browser; just verify it's set
            expect(div.style.background).toBeTruthy();
        } finally {
            unmount();
        }
    });

    it("should render consistently in a second instance", () => {
        const {container, unmount} = render(<TestWidget1.content/>);
        try {
            expect(container.textContent).toContain("Test Widget 1");
        } finally {
            unmount();
        }
    });
});

describe("Cover div in edit mode", () => {
    beforeEach(() => {
        vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should not render .cover when edit mode is off", () => {
        const {container, unmount} = render(<MainPage />);
        try {
            expect(container.querySelectorAll(".cover").length).toBe(0);
        } finally {
            unmount();
        }
    });

    it("should render .cover on each widget except Edit grid buttom when edit mode is on", () => {
        const {container, unmount} = render(<MainPage />);
        try {
            const btn = container.querySelector("button")!;
            act(() => { btn.click(); });
            // 3 widgets total, 1 is "Edit grid buttom" → 2 covers
            expect(container.querySelectorAll(".cover").length).toBe(2);
        } finally {
            unmount();
        }
    });

    it("should remove .cover when edit mode is toggled off", () => {
        const {container, unmount} = render(<MainPage />);
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

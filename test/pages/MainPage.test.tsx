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



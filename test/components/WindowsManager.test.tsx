import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {createRoot} from "react-dom/client";
import {act} from "react";

// ---- mocks ----

// Track resize callbacks so tests can invoke them
const mockResize = vi.hoisted(() => ({
    onResize: null as ((e: any, data: any) => void) | null,
}));

// Track drag callbacks so tests can invoke them
const mockDrag = vi.hoisted(() => ({
    onDrag: null as ((e: any, data: any) => void) | null,
    position: null as {x: number; y: number} | null,
}));

vi.mock("react-draggable", () => ({
    default: ({children, onDrag, position, ..._rest}: any) => {
        mockDrag.onDrag = onDrag || null;
        mockDrag.position = position;
        return <div data-testid="draggable">{children}</div>;
    },
}));

vi.mock("react-resizable", () => ({
    ResizableBox: ({children, onResize, width, height, ..._rest}: any) => {
        mockResize.onResize = onResize || null;
        return (
            <div data-testid="resizable" data-width={width} data-height={height}>
                {children}
            </div>
        );
    },
}));

// Controlled mock of WindowsContext so we don't fight the useEffect
const mockWindowsValue = vi.hoisted(() => ({
    value: new Map() as Readonly<Map<string, any>>,
    create: vi.fn(),
    delete: vi.fn(),
}));

vi.mock("../../src/context/WindowsContext", () => ({
    useWindows: () => mockWindowsValue,
    WindowsProvider: ({children}: any) => <>{children}</>,
}));

// localStorage polyfill for jsdom + Node
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

// ---- imports after mocks ----
import WindowsManager from "../../src/components/WindowsManager";

// ---- helpers ----

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

function TestContent() {
    return <div data-testid="test-content">hello</div>;
}

/** Set the map of windows returned by useWindows() */
function setWindows(windows: Record<string, any>): void {
    const map = new Map<string, any>();
    for (const [id, cfg] of Object.entries(windows)) {
        map.set(id, {
            id,
            title: id,
            content: TestContent,
            ...cfg,
        });
    }
    (mockWindowsValue.value as any) = map;
}

// ---- tests ----

describe("WindowsManager", () => {
    beforeEach(() => {
        vi.spyOn(console, "log").mockImplementation(() => {});
        vi.spyOn(console, "error").mockImplementation(() => {});
        mockWindowsValue.create.mockClear();
        mockWindowsValue.delete.mockClear();
        mockWindowsValue.value = new Map();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        mockDrag.onDrag = null;
        mockDrag.position = null;
        mockResize.onResize = null;
    });

    it("renders a window for each entry in context", () => {
        setWindows({win1: {}});
        const {container, unmount} = render(<WindowsManager/>);
        try {
            const windows = container.querySelectorAll('[data-testid="draggable"]');
            expect(windows).toHaveLength(1);
            expect(container.querySelector('[data-testid="test-content"]')).toBeTruthy();
        } finally {
            unmount();
        }
    });

    it("renders multiple windows", () => {
        setWindows({win1: {}, win2: {}});
        const {container, unmount} = render(<WindowsManager/>);
        try {
            expect(
                container.querySelectorAll('[data-testid="draggable"]'),
            ).toHaveLength(2);
            expect(
                container.querySelectorAll('[data-testid="test-content"]'),
            ).toHaveLength(2);
        } finally {
            unmount();
        }
    });

    it("shows the title in the titlebar", () => {
        setWindows({myWindow: {title: "My Title"}});
        const {container, unmount} = render(<WindowsManager/>);
        try {
            expect(container.querySelector(".wm-titlebar-text")!.textContent).toBe(
                "My Title",
            );
        } finally {
            unmount();
        }
    });

    describe("drag", () => {
        it("starts at default position 50,50", () => {
            setWindows({win1: {}});
            const {unmount} = render(<WindowsManager/>);
            try {
                expect(mockDrag.position).toEqual({x: 50, y: 50});
            } finally {
                unmount();
            }
        });

        it("uses defaultPosition from config", () => {
            setWindows({win1: {defaultPosition: {x: 100, y: 200}}});
            const {unmount} = render(<WindowsManager/>);
            try {
                expect(mockDrag.position).toEqual({x: 100, y: 200});
            } finally {
                unmount();
            }
        });

        it("updates position on drag", () => {
            setWindows({win1: {}});
            const {unmount} = render(<WindowsManager/>);
            try {
                expect(mockDrag.onDrag).toBeTruthy();
                act(() => {
                    mockDrag.onDrag!({} as any, {x: 120, y: 340});
                });
                expect(mockDrag.position).toEqual({x: 120, y: 340});
            } finally {
                unmount();
            }
        });
    });

    describe("resize", () => {
        it("starts at default size 400x300", () => {
            setWindows({win1: {}});
            const {container, unmount} = render(<WindowsManager/>);
            try {
                const resizable = container.querySelector(
                    '[data-testid="resizable"]',
                )!;
                expect(resizable.getAttribute("data-width")).toBe("400");
                expect(resizable.getAttribute("data-height")).toBe("300");
            } finally {
                unmount();
            }
        });

        it("uses defaultSize from config", () => {
            setWindows({win1: {defaultSize: {width: 640, height: 480}}});
            const {container, unmount} = render(<WindowsManager/>);
            try {
                const resizable = container.querySelector(
                    '[data-testid="resizable"]',
                )!;
                expect(resizable.getAttribute("data-width")).toBe("640");
                expect(resizable.getAttribute("data-height")).toBe("480");
            } finally {
                unmount();
            }
        });

        describe.each([
            // handle  newSize         expectedPos         expectedSize
            ["se",  {width: 500, height: 400}, {x: 50, y: 50},   {width: 500, height: 400}],
            ["sw",  {width: 500, height: 400}, {x: -50, y: 50},  {width: 500, height: 400}],
            ["ne",  {width: 500, height: 400}, {x: 50, y: -50},  {width: 500, height: 400}],
            ["nw",  {width: 500, height: 400}, {x: -50, y: -50}, {width: 500, height: 400}],
            ["e",   {width: 500, height: 400}, {x: 50, y: 50},   {width: 500, height: 400}],
            ["w",   {width: 500, height: 400}, {x: -50, y: 50},  {width: 500, height: 400}],
            ["n",   {width: 500, height: 400}, {x: 50, y: -50},  {width: 500, height: 400}],
            ["s",   {width: 500, height: 400}, {x: 50, y: 50},   {width: 500, height: 400}],
        ] as const)(
            "handle '%s': position correction + size update",
            (handle, newSize, expectedPos, expectedSize) => {
                it(`corrects position to ${JSON.stringify(expectedPos)} and size to ${JSON.stringify(expectedSize)}`, () => {
                    setWindows({win1: {}});
                    const {container, unmount} = render(<WindowsManager/>);
                    try {
                        expect(mockResize.onResize).toBeTruthy();
                        act(() => {
                            mockResize.onResize!({} as any, {
                                handle,
                                size: newSize,
                            });
                        });
                        const resizable = container.querySelector(
                            '[data-testid="resizable"]',
                        )!;
                        expect(mockDrag.position).toEqual(expectedPos);
                        expect(resizable.getAttribute("data-width")).toBe(
                            String(expectedSize.width),
                        );
                        expect(resizable.getAttribute("data-height")).toBe(
                            String(expectedSize.height),
                        );
                    } finally {
                        unmount();
                    }
                });
            },
        );
    });

    describe("close button", () => {
        it("renders close button by default (isClosable not set)", () => {
            setWindows({win1: {}});
            const {container, unmount} = render(<WindowsManager/>);
            try {
                expect(container.querySelector(".wm-close-btn")).toBeTruthy();
            } finally {
                unmount();
            }
        });

        it("hides close button when isClosable=false", () => {
            setWindows({win1: {isClosable: false}});
            const {container, unmount} = render(<WindowsManager/>);
            try {
                expect(container.querySelector(".wm-close-btn")).toBeFalsy();
            } finally {
                unmount();
            }
        });

        it("shows close button when isClosable=true", () => {
            setWindows({win1: {isClosable: true}});
            const {container, unmount} = render(<WindowsManager/>);
            try {
                expect(container.querySelector(".wm-close-btn")).toBeTruthy();
            } finally {
                unmount();
            }
        });
    });

    describe("structure", () => {
        it("renders .window-layer > [data-testid=draggable] > [data-testid=resizable] > .window-card", () => {
            setWindows({win1: {}});
            const {container, unmount} = render(<WindowsManager/>);
            try {
                const layer = container.querySelector(".window-layer")!;
                expect(layer).toBeTruthy();

                const draggable = layer.querySelector(
                    '[data-testid="draggable"]',
                )!;
                expect(draggable).toBeTruthy();

                const resizable = draggable.querySelector(
                    '[data-testid="resizable"]',
                )!;
                expect(resizable).toBeTruthy();

                const card = resizable.querySelector(".window-card")!;
                expect(card).toBeTruthy();

                const titlebar = card.querySelector(".window-titlebar")!;
                expect(titlebar).toBeTruthy();

                const content = card.querySelector(".wm-content")!;
                expect(content).toBeTruthy();
                expect(
                    content.querySelector('[data-testid="test-content"]'),
                ).toBeTruthy();
            } finally {
                unmount();
            }
        });
    });
});

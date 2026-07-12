import {describe, it, expect, vi, beforeAll, afterAll} from "vitest";

// Mock App so main.tsx doesn't pull in the full dep tree
vi.mock("../src/App", () => ({
    default: () => null,
}));

describe("main entry point", () => {
    beforeAll(() => {
        const rootEl = document.createElement("div");
        rootEl.id = "root";
        document.body.appendChild(rootEl);
    });

    afterAll(() => {
        const rootEl = document.getElementById("root");
        if (rootEl) rootEl.remove();
        vi.restoreAllMocks();
    });

    it("should set window.process on import", async () => {
        // Import triggers module-level code: window.process = { env: {} } and createRoot().render()
        await import("../src/main");

        // window.process was set by main.tsx — this covers the 1 uncovered line
        expect((window as any).process).toBeDefined();
        expect((window as any).process.env).toEqual({});
    });
});

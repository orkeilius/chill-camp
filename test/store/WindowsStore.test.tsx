import {describe, it, expect} from "vitest";
import {useWindowsStore} from "../../src/store/WindowsStore";

describe("WindowsStore", () => {
    it("starts with empty map", () => {
        expect(useWindowsStore.getState().value.size).toBe(0);
    });

    it("create adds a window config", () => {
        useWindowsStore.getState().create({
            id: "test-1",
            title: "Test",
            content: () => <div />,
        });
        const val = useWindowsStore.getState().value;
        expect(val.size).toBe(1);
        expect(val.get("test-1")?.title).toBe("Test");
    });

    it("delete removes a window config", () => {
        useWindowsStore.getState().create({
            id: "test-1",
            title: "Test",
            content: () => <div />,
        });
        useWindowsStore.getState().delete("test-1");
        expect(useWindowsStore.getState().value.size).toBe(0);
    });

    it("delete on missing id does nothing", () => {
        useWindowsStore.getState().create({
            id: "test-1",
            title: "Test",
            content: () => <div />,
        });
        useWindowsStore.getState().delete("no-such-id");
        expect(useWindowsStore.getState().value.size).toBe(1);
    });

    it("create with same id overwrites", () => {
        useWindowsStore.getState().create({
            id: "test-1",
            title: "First",
            content: () => <div />,
        });
        useWindowsStore.getState().create({
            id: "test-1",
            title: "Second",
            content: () => <div />,
        });
        expect(useWindowsStore.getState().value.size).toBe(1);
        expect(useWindowsStore.getState().value.get("test-1")?.title).toBe("Second");
    });
});

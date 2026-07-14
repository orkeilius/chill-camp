import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";

vi.mock("../../../src/services/modService", () => ({
    default: {
        listOfPlaylists: [
            {
                name: "Playlist A",
                getNextMusic: () => new URL("https://example.com/a.mp3"),
            },
            {
                name: "Playlist B",
                getNextMusic: () => new URL("https://example.com/b.mp3"),
            },
        ],
    },
}));

vi.mock("../../../src/services/mainTrackService", () => ({
    default: {
        getCurrentPlaylist: vi.fn(() => null),
        changePlaylist: vi.fn(),
    },
}));

import { PlaylistSelectorWidget } from "../../../src/mod/Default/PlaylistSelectorWidget";
import mainTrackService from "../../../src/services/mainTrackService";

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

describe("PlaylistSelectorWidget", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render a select with playlist options", () => {
        const { container, unmount } = render(
            <PlaylistSelectorWidget.content />,
        );
        try {
            const select = container.querySelector("select");
            expect(select).toBeTruthy();
            const options = container.querySelectorAll("option");
            expect(options).toHaveLength(2);
            expect(options[0].textContent).toBe("Playlist A");
            expect(options[1].textContent).toBe("Playlist B");
        } finally {
            unmount();
        }
    });

    it("should call changePlaylist when a different playlist is selected", () => {
        const { container, unmount } = render(
            <PlaylistSelectorWidget.content />,
        );
        try {
            const select = container.querySelector("select")!;
            act(() => {
                select.value = "Playlist B";
                select.dispatchEvent(new Event("change", { bubbles: true }));
            });
            expect(mainTrackService.changePlaylist).toHaveBeenCalledWith(
                expect.objectContaining({ name: "Playlist B" }),
            );
        } finally {
            unmount();
        }
    });

    it("should log error when selected playlist is not found", () => {
        const consoleSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        const { container, unmount } = render(
            <PlaylistSelectorWidget.content />,
        );
        try {
            const select = container.querySelector("select")!;
            act(() => {
                select.value = "NonExistent";
                select.dispatchEvent(new Event("change", { bubbles: true }));
            });
            expect(consoleSpy).toHaveBeenCalledWith(
                "selected playlist not found",
            );
            expect(mainTrackService.changePlaylist).not.toHaveBeenCalled();
        } finally {
            unmount();
        }
    });
});

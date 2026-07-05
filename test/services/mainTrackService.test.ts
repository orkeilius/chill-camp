import { describe, it, expect, vi, beforeEach } from "vitest";

const mockTrack = vi.hoisted(() => ({
  play: vi.fn(),
  addEndCallback: vi.fn(),
  stop: vi.fn(),
  removeEndCallback: vi.fn(),
}));

// Mock dependencies before importing the service under test
vi.mock("../../src/services/audioService", () => ({
  audioService: {
    getTrack: vi.fn(() => mockTrack),
  },
}));

vi.mock("../../src/services/modService", () => ({
  default: {
    listOfPlaylists: [],
  },
}));

// Now import the service
import mainTrackService from "../../src/services/mainTrackService";
import modService from "../../src/services/modService";

describe("MainTrackService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("launchNextMusic", () => {
    it("should log error if no current playlist selected", () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // Ensure it's fresh or manually triggered without start()
      mainTrackService.launchNextMusic();
      expect(consoleSpy).toHaveBeenCalledWith('No current playlist selected');
    });

    it("should play next music from the current playlist", () => {
      const mockPlaylist = {
        name: "Test Playlist",
        getNextMusic: () => new URL("https://example.com/next.mp3")
      } as any;

      modService.listOfPlaylists = [mockPlaylist];
      mainTrackService.start(); // This sets the private currentPlaylist

      mainTrackService.launchNextMusic();

      expect(mockTrack.play).toHaveBeenCalledWith("https://example.com/next.mp3");
    });
  });

  describe("start", () => {
    it("should log error if no playlists available", () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      modService.listOfPlaylists = [];
      
      mainTrackService.start();
      expect(consoleSpy).toHaveBeenCalledWith('No playlists available');
    });

    it("should pick a random playlist and start music", () => {
      const mockPlaylist = {
        name: "Test Playlist",
        getNextMusic: () => new URL("https://example.com/test.mp3")
      } as any;
      
      modService.listOfPlaylists = [mockPlaylist];

      mainTrackService.start();

      expect(mockTrack.addEndCallback).toHaveBeenCalled();
      expect(mockTrack.play).toHaveBeenCalledWith("https://example.com/test.mp3");
    });
  });

  describe("stop", () => {
    it("should call stop on the track and remove callback", () => {
      const mockPlaylist = {
        name: "Test Playlist",
        getNextMusic: () => new URL("https://example.com/test.mp3")
      } as any;

      modService.listOfPlaylists = [mockPlaylist];
      mainTrackService.start(); // sets listenerId
      vi.clearAllMocks(); // reset call counts from start()

      mainTrackService.stop();

      expect(mockTrack.stop).toHaveBeenCalled();
      expect(mockTrack.removeEndCallback).toHaveBeenCalled();
    });
  });
});

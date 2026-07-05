import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AudioTrack, AudioService, audioService } from "./audioService";

describe("AudioTrack", () => {
  let track: AudioTrack;
  let audioElement: HTMLAudioElement;

  beforeEach(() => {
    track = new AudioTrack();

    audioElement = (track as unknown as { audioPlayer: HTMLAudioElement }).audioPlayer;

    vi.spyOn(audioElement, "play").mockResolvedValue(undefined);
    vi.spyOn(audioElement, "pause").mockImplementation(() => {});
    vi.spyOn(audioElement, "addEventListener").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("play", () => {
    it("should set the src on the audio element", () => {
      track.play("https://example.com/audio.mp3");
      expect(audioElement.src).toBe("https://example.com/audio.mp3");
    });

    it("should call play() on the audio element", () => {
      track.play("https://example.com/audio.mp3");
      expect(audioElement.play).toHaveBeenCalledTimes(1);
    });

    it("should work with different URLs", () => {
      track.play("/local/sound.wav");
      expect(audioElement.src).toMatch(/\/local\/sound\.wav$/);
      expect(audioElement.play).toHaveBeenCalledTimes(1);
    });
  });

  describe("stop", () => {
    it("should pause the audio element", () => {
      track.stop();
      expect(audioElement.pause).toHaveBeenCalledTimes(1);
    });

    it("should reset currentTime to 0", () => {
      audioElement.currentTime = 42;
      track.stop();
      expect(audioElement.currentTime).toBe(0);
    });
  });

  describe("addEndCallback", () => {
    it("should register an ended event listener", () => {
      const callback = vi.fn();
      track.addEndCallback(callback);
      expect(audioElement.addEventListener).toHaveBeenCalledTimes(1);
      expect(audioElement.addEventListener).toHaveBeenCalledWith(
        "ended",
        expect.any(Function)
      );
    });

    it("should invoke the callback with the track when ended fires", () => {
      const callback = vi.fn();
      track.addEndCallback(callback);

      // Retrieve the handler that was registered and call it manually
      const handler = vi.mocked(audioElement.addEventListener).mock.calls[0][1] as EventListener;
      handler(new Event("ended"));

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(track);
    });

    it("should support multiple callbacks", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      track.addEndCallback(callback1);
      track.addEndCallback(callback2);

      const handler1 = vi.mocked(audioElement.addEventListener).mock.calls[0][1] as EventListener;
      const handler2 = vi.mocked(audioElement.addEventListener).mock.calls[1][1] as EventListener;

      handler1(new Event("ended"));
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();

      handler2(new Event("ended"));
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe("setVolume", () => {
    it("should set the volume on the audio element", () => {
      track.setVolume(0.5);
      expect(audioElement.volume).toBe(0.5);
    });

    it("should accept 0 (mute)", () => {
      track.setVolume(0);
      expect(audioElement.volume).toBe(0);
    });

    it("should accept 1 (max)", () => {
      track.setVolume(1);
      expect(audioElement.volume).toBe(1);
    });
  });
});

describe("AudioService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("getTrack", () => {
    it("should return an AudioTrack for a given id", () => {
      const track = audioService.getTrack("track-1");
      expect(track).toBeInstanceOf(AudioTrack);
    });

    it("should return the same track for the same id", () => {
      const track1 = audioService.getTrack("same-id");
      const track2 = audioService.getTrack("same-id");
      expect(track1).toBe(track2);
    });

    it("should return different tracks for different ids", () => {
      const trackA = audioService.getTrack("id-a");
      const trackB = audioService.getTrack("id-b");
      expect(trackA).not.toBe(trackB);
    });

    it("should return an AudioTrack for multiple distinct ids", () => {
      const ids = ["a", "b", "c", "d"];
      const tracks = ids.map((id) => audioService.getTrack(id));
      tracks.forEach((t) => expect(t).toBeInstanceOf(AudioTrack));

      const uniqueTracks = new Set(tracks);
      expect(uniqueTracks.size).toBe(ids.length);
    });
  });

  it("should export a singleton instance", async () => {
    expect(audioService).toBeInstanceOf(AudioService);
    const { audioService: importedAgain } = await import("./audioService");
    expect(audioService).toBe(importedAgain);
  });
});

import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import {audioService, AudioTrack} from "./audioService";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  const [track, _] = useState(audioService.getTrack("main"));

  useEffect(() => {
    track.addEndCallback(audioLogic);
    audioLogic(track);

    return () => {track?.stop()}
  }, [track]);

  async function audioLogic(track: AudioTrack) {
    console.log("Audio track ended:", track);
    const nextTrack = Math.random() < 0.5 ? "/test1.mp3" : "/test2.mp3";
      track.play(nextTrack);
  }

  function toggleAudio() {
      audioLogic(track)
  }

  return (
    <main className="container">
      <button onClick={toggleAudio}>
        {isPlaying ? "Stop Audio" : "Play Audio"}
      </button>

      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

    </main>
  );
}

export default App;

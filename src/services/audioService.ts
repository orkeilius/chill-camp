export class AudioService {
    private readonly tracks: Map<string, AudioTrack> = new Map();

    public getTrack(id: string): AudioTrack {
        if (!this.tracks.has(id)) {
            this.tracks.set(id, new AudioTrack());
        }
        return <AudioTrack>this.tracks.get(id);
    }

}

export const audioService = new AudioService();

// facade to audio feature
// may add other impl for better cross-platform support
export class AudioTrack {

    private readonly audioPlayer: HTMLAudioElement;

    private readonly listener: Map<string, (() => void)> = new Map();


    constructor() {
        this.audioPlayer = new Audio();
    }

    public play(src: string) {
        this.audioPlayer.src = src;
        this.audioPlayer.play();
    }

    public stop() {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
    }

    public addEndCallback(key: string, callback: ((track: AudioTrack) => void)): string {
        if (this.listener.has(key)) {
            console.warn(`Listener with key ${key} already exists.`);
            this.removeEndCallback(key);
        }
        let listener = () => callback(this);
        this.listener.set(key, listener);
        this.audioPlayer.addEventListener('ended', listener);
        return key;
    }

    public removeEndCallback(key: string) {
        const listener = this.listener.get(key);
        if (!listener) {
            console.warn(`No listener found for id: ${key}`);
            return;
        }
        this.audioPlayer.removeEventListener('ended', listener);
        this.listener.delete(key);
    }


    public setVolume(volume: number) {
        this.audioPlayer.volume = volume;
    }
}
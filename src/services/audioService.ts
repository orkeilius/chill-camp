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

    public addEndCallback(callback: ((track: AudioTrack)=> void)) {
        this.audioPlayer.addEventListener('ended', () => callback(this));
    }

    public removeEndCallback(callback: ((track: AudioTrack)=> void)) {
        this.audioPlayer.removeEventListener('ended', () => callback(this));
    }


    public setVolume(volume: number) {
        this.audioPlayer.volume = volume;
    }
}
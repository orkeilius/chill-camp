import modService from './modService';
import { audioService } from './audioService.ts';

class MainTrackService {
    private readonly track = audioService.getTrack('main');
    private currentPlaylist: Playlist | null = null;

    public start() {
        const playlists = modService.listOfPlaylists;
        if (playlists.length === 0) {
            console.error('No playlists available');
            return;
        }
        // Run a random playlist for now
        const randomIndex = Math.floor(Math.random() * playlists.length);
        this.currentPlaylist = playlists[randomIndex];

        this.track.addEndCallback(() => this.launchNextMusic());
        this.launchNextMusic()
    }

    public async launchNextMusic() {
        if (!this.currentPlaylist) {
            console.error('No current playlist selected');
            return
        }
        const nextMusic = this.currentPlaylist.getNextMusic();

        this.track.play(nextMusic.toString());
    }

    public stop() {
        if (this.track) {
            this.track.stop();
        }
        this.track.removeEndCallback(() => this.launchNextMusic());
    }
}

export default new MainTrackService();
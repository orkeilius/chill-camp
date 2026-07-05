import modService from './modService';
import { audioService } from './audioService';
import { Playlist } from '../interface/Playlist';

const MainTrackOnEndCallbackId = 'MainTrackOnEndCallback';

class MainTrackService {
    private readonly track = audioService.getTrack('main');
    private currentPlaylist: Playlist | null = null;

    private listenerId: string | null = null;

    public start() {
        const playlists = modService.listOfPlaylists;
        if (playlists.length === 0) {
            console.error('No playlists available');
            return;
        }
        // Run a random playlist for now
        const randomIndex = Math.floor(Math.random() * playlists.length);
        this.currentPlaylist = playlists[randomIndex];

        this.listenerId = this.track.addEndCallback(MainTrackOnEndCallbackId, () => this.launchNextMusic());
        this.launchNextMusic()
            .catch((error) => console.error('Error occurred while launching next music:', error));
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
        this.track.stop();
        if (this.listenerId !== null) {
            this.track.removeEndCallback(MainTrackOnEndCallbackId);
        }
    }
}

export default new MainTrackService();
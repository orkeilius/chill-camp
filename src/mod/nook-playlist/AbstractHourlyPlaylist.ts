import { Playlist } from "../../interface/Playlist";



export default abstract class AbstractHourlyPlaylist implements Playlist {
    abstract name: string;

    abstract musics: Record<number, URL>;

    getNextMusic(): URL {
        const currentHour = new Date().getHours();
        return this.musics[currentHour];
    }
}


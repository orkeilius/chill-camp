import { Playlist } from "./Playlist";
import {Widget} from "./widget";

export default abstract class Mod {
    abstract name: string;

    public getPlaylists(): Playlist[]{
        return []
    };
    public getWidget(): Widget[]{
        return []
    }
}
import { Playlist } from "./Playlist";

export interface Mod {
    name: string;
    getPlaylists: () => Playlist[];
}
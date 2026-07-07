import { Mod } from "../../interface/Mod";
import { Playlist } from "../../interface/Playlist";
import SunnyAcnrPlaylist from "./SunnyAcnrPlaylist";


export default class NookMod implements Mod {
    name = "NookMod";

    getPlaylists(): Playlist[] {
        return [
            new SunnyAcnrPlaylist()
        ];
    }
}
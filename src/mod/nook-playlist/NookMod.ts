import { Playlist } from "../../interface/Playlist";
import SunnyAcnrPlaylist from "./SunnyAcnrPlaylist";
import Mod from "../../interface/Mod";


export default class NookMod extends Mod {
    name = "NookMod";

    getPlaylists(): Playlist[] {
        return [
            new SunnyAcnrPlaylist()
        ];
    }
}
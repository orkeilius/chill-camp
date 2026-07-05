import TestPlaylist from "./TestPlaylist";
import { Mod } from "../../interface/Mod";
import { Playlist } from "../../interface/Playlist";


export default class TestMod implements Mod {
    name = "TestMod";

    getPlaylists(): Playlist[] {
        return [
            new TestPlaylist()
        ];
    }
}
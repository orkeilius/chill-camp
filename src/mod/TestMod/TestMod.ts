import TestPlaylist from "./TestPlaylist";
import { Playlist } from "../../interface/Playlist";
import Mod from "../../interface/Mod";
import {Widget} from "../../interface/widget";
import {TestWidget1} from "./TestWidget1";


export default class TestMod extends Mod {
    name = "TestMod";

    getPlaylists(): Playlist[] {
        return [
            new TestPlaylist()
        ];
    }
    getWidget(): Widget[] {
        return [
            TestWidget1
        ];
    }
}
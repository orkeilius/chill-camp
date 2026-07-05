import TestPlaylist from "./TestPlaylist.ts";


export default class TestMod implements Mod {
    name = "TestMod";

    getPlaylists(): Playlist[] {
        return [
            new TestPlaylist()
        ];
    }
}
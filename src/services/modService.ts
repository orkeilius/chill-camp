import TestMod from "../mod/TestMod/TestMod";
import { Playlist } from "../interface/Playlist";
import { Mod } from "../interface/Mod";

class ModService {

    public readonly listOfMods: Mod[] = [
        new TestMod(),
    ]

    public readonly listOfPlaylists: Playlist[] = [];

    constructor() {
        this.listOfMods.forEach((mod) => {
            this.listOfPlaylists.push(...mod.getPlaylists());
        });
    }
}


export default new ModService();
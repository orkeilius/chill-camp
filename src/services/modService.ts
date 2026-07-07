import {Playlist} from "../interface/Playlist";
import {Mod} from "../interface/Mod";
import NookMod from "../mod/nook-playlist/NookMod.ts";

class ModService {

    public readonly listOfMods: Mod[] = [
        new NookMod(),
        //new TestMod(),
    ]

    public readonly listOfPlaylists: Playlist[] = [];

    constructor() {
        this.listOfMods.forEach(mod => {
            this.listOfPlaylists.push(...mod.getPlaylists());
        });
    }
}


export default new ModService();
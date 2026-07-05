import TestMod from "../mod/TestMod/TestMod.ts";

class ModService {

    public ListOfMods: Mod[] = [
        new TestMod(),
    ]

    public listOfPlaylists: Playlist[] = [];

    constructor() {
        this.ListOfMods.forEach((mod) => {
            this.listOfPlaylists.push(...mod.getPlaylists());
        });
    }
}


export default new ModService();
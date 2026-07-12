import {Playlist} from "../interface/Playlist";
import NookMod from "../mod/nook-playlist/NookMod.ts";
import TestMod from "../mod/TestMod/TestMod";
import Mod from "../interface/Mod";
import SystemWidgetMod from "../mod/systemWidgetMod/SystemWidgetMod";
import {Widget} from "../interface/widget";
import defaultMod from "../mod/Default/DefaultMod.ts";

class ModService {
    public readonly listOfMods: Mod[] = [
        new SystemWidgetMod(),
        new defaultMod(),
        new NookMod(),
        new TestMod(),
    ];

    public readonly listOfPlaylists: Playlist[] = [];
    public readonly listOfWidgets: Widget[] = [];

    constructor() {
        this.listOfMods.forEach((mod) => {
            this.listOfPlaylists.push(...mod.getPlaylists());
            this.listOfWidgets.push(...mod.getWidget());
        });
    }
}

export default new ModService();

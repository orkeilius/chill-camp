import {Playlist} from "../interface/Playlist";
import NookMod from "../mod/nook-playlist/NookMod.ts";
import Widget from "../interface/widget";
import TestMod from "../mod/TestMod/TestMod";
import Mod from "../interface/Mod";
import SystemWidgetMod from "../mod/systemWidgetMod/SystemWidgetMod";
import {Widget} from "../interface/widget";

class ModService {

    public readonly listOfMods: Mod[] = [
        new NookMod(),
        new TestMod(),
    ]

    public readonly listOfPlaylists: Playlist[] = [];
    public readonly listOfWidgets: Widget[] = [];

    constructor() {
        this.listOfMods.forEach(mod => {
            this.listOfPlaylists.push(...mod.getPlaylists());
            this.listOfWidgets.push(...mod.getWidget());
        });
    }
}


export default new ModService();
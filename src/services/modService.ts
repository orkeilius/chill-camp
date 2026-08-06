import {Playlist} from "../interface/Playlist";
import NookMod from "../mod/nook-playlist/NookMod.ts";
import TestMod from "../mod/TestMod/TestMod";
import Mod from "../interface/Mod";
import SystemWidgetMod from "../mod/systemWidgetMod/SystemWidgetMod";
import {Widget} from "../interface/widget";
import DefaultMod from "../mod/Default/DefaultMod.ts";

class ModService {
    public readonly mods: Record<string, Mod> = Object.fromEntries(
        [
            new SystemWidgetMod(),
            new DefaultMod(),
            new NookMod(),
            new TestMod()
        ].map((mod) => [mod.name, mod])
    );

    public readonly listOfPlaylists: Playlist[] = [];
    public readonly listOfWidgets: Map<string, Widget> = new Map();

    constructor() {
        Object.values(this.mods).forEach((mod) => {
            this.listOfPlaylists.push(...mod.getPlaylists());
            mod.getWidget().forEach((widget) => {
                this.listOfWidgets.set(widget.name, widget);
            });
        });
    }
}

let modInstance: ModService | null = null;
export default new Proxy({} as ModService, {
    get(_target, prop) {
        modInstance ??= new ModService();
        return modInstance[prop as keyof ModService];
    },
});

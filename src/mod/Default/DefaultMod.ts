import Mod from "../../interface/Mod";
import { Widget } from "../../interface/widget";
import { PlaylistSelectorWidget } from "./PlaylistSelectorWidget";

export default class DefaultMod extends Mod {
    name = "Default";

    getWidget(): Widget[] {
        return [PlaylistSelectorWidget];
    }
}

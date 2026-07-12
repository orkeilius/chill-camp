import Mod from "../../interface/Mod";
import { Widget } from "../../interface/widget";
import { PlaylistSeletorWidget } from "./PlaylistSelectorWidget";

export default class defaultMod extends Mod {
  name = "Default";

  getWidget(): Widget[] {
    return [PlaylistSeletorWidget];
  }
}

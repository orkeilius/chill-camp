import Mod from "../../interface/Mod";
import {Widget} from "../../interface/widget";
import {EditWidget} from "./EditWidget";


export default class SystemWidgetMod extends Mod {
    name = "System widget";

    getWidget(): Widget[] {
       return [
           EditWidget
       ]
    }
}
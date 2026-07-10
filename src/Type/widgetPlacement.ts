import {Widget} from "../interface/widget";

export type WidgetPlacement = {
    widget : Widget
    position: {x:number,y:number}
    size: {width: number, height: number}
}
import "../css/MainPage.css";
import ModService from "../services/modService";
import {WidgetPlacement} from "../Type/widgetPlacement";

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const widgets: WidgetPlacement[] = ModService.listOfWidgets.map(w => ({
    widget: w,
    position: {x: rand(1, 8), y: rand(1, 8)},
    size: {width: rand(w.minSize.width, w.maxSize.width), height: rand(w.minSize.height, w.maxSize.height)},
}));

export default function MainPage() {
    return (<div className="grid">
        {widgets.map(({widget, position, size}, index) => (
            <div
                key={index}
                style={{
                    gridColumn: `${position.x} / span ${size.width}`,
                    gridRow: `${position.y} / span ${size.height}`,
                }}
            >
                <widget.content/>
            </div>
        ))}
    </div>)
}

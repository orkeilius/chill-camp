import "../css/MainPage.css";
import ModService from "../services/modService";
let widgets = ModService.listOfWidgets;

export default function MainPage() {
    return (<div className="grid">
        {widgets.map((widget, index) => (
            <div
                key={index}
                style={{
                    gridColumn: `span ${widget.minSize.height}`,
                    gridRow: `span ${widget.minSize.width}`,
                }}
            >
                <widget.content/>
            </div>
        ))}
    </div>)

}

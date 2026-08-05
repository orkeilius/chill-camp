import {useWidgetsStore} from "../store/WidgetsStore";
import modService from "../services/modService";

export default function WidgetListPage(){

    const widgetStore =  useWidgetsStore(s => s.addWidget)

    return (
        <div className="widget-list-page">
            {Array.from(modService.listOfWidgets.values()).map((widget) => (
                <div key={widget.name} className="widget" onClick={() => widgetStore(widget)}>
                    <h3>{widget.name}</h3>
                </div>
            ))}
        </div>
    )
}
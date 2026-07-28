import "../css/MainPage.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { ReactGridLayout, useContainerWidth } from "react-grid-layout";
import modService from "../services/modService";
import {useWidgetsStore} from "../store/WidgetsStore";

const CellSize = 50;

const widgets = modService.listOfWidgets;

export default function GridContainer() {
    const {
        width: containerWidth,
        containerRef,
        mounted,
    } = useContainerWidth();
    const widgetsStore = useWidgetsStore()

    return (
        <div ref={containerRef} style={{ minHeight: "100vh" }}>
            {mounted && (
                <ReactGridLayout
                    width={containerWidth}
                    gridConfig={{
                        cols: Math.ceil(containerWidth / CellSize) - 1,
                        rowHeight: CellSize,
                        margin: [0, 0],
                    }}
                    dragConfig={{ enabled: widgetsStore.isEditMode }}
                    resizeConfig={{ enabled: widgetsStore.isEditMode }}
                    layout={widgetsStore.layout}
                    onLayoutChange={widgetsStore.updateLayout}
                >
                    {widgets.map(widget => (
                        <div key={widget.name}>
                            <WidgetGridItem
                                key={widget.name}
                                widget={widget}
                            />
                        </div>
                    ))}
                </ReactGridLayout>
            )}
        </div>
    );
}

type WidgetGridItemProp = {
    widget: (typeof widgets)[0];
};

function WidgetGridItem(props: Readonly<WidgetGridItemProp>) {
    const isEditMode = useWidgetsStore(s => s.isEditMode)
    const isCovered = isEditMode && props.widget.name !== "Edit grid buttom";

    return (
        <>
            {isCovered && <div className="cover" />}
            <props.widget.content />
        </>
    );
}

import "../css/MainPage.css";
import ModService from "../services/modService";
import {ReactGridLayout, useContainerWidth} from "react-grid-layout";

const CellSize = 50

const widgets = ModService.listOfWidgets

export default function MainPage() {

    const {width: containerWidth, containerRef, mounted} = useContainerWidth();

    console.log(Math.floor(containerWidth / CellSize))
    return (
        <div ref={containerRef} style={{minHeight: "100vh"}}>
            {mounted && <ReactGridLayout
                width={containerWidth}
                gridConfig={{
                    cols: Math.ceil(containerWidth / CellSize) - 1,
                    rowHeight: CellSize,
                    margin: [0, 0]
                }}
                dragConfig={{enabled: true}}
            >
                {widgets.map((widget, i) => (
                    <div key={i} data-grid={{
                        minW: widget.minSize.width,
                        minH: widget.minSize.height,
                        maxW: widget.maxSize.width,
                        maxH: widget.maxSize.height,
                        w: 2,
                        h: 2
                    }}>
                        <widget.content/>
                    </div>
                ))}
            </ReactGridLayout>}</div>
    )
}

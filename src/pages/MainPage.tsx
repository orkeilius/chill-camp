import {useState} from "react";
import "../css/MainPage.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import ModService from "../services/modService";
import {ReactGridLayout, useContainerWidth} from "react-grid-layout";
import {EditModeProvider, useEditMode} from "../context/EditModeContext";

const CellSize = 50
const STORAGE_KEY = "grid-layout"

const widgets = ModService.listOfWidgets

function loadLayout() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) return JSON.parse(saved)
    } catch (e) {
        console.error(e)
    }
    return widgets.map((w, i) => ({
        i: w.name,
        x: 0, y: i,
        w: w.minSize.width,
        h: w.minSize.height,
        minW: w.minSize.width,
        minH: w.minSize.height,
        maxW: w.maxSize.width,
        maxH: w.maxSize.height,
    }))
}

function PageContent() {
    const {editMode} = useEditMode()
    const {width: containerWidth, containerRef, mounted} = useContainerWidth();
    const [layout, setLayout] = useState(loadLayout)

    const handleLayoutChange = (newLayout: any) => {
        setLayout(newLayout)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayout))
    }

    return (
        <div ref={containerRef} style={{minHeight: "100vh"}}>
            {mounted && <ReactGridLayout
                width={containerWidth}
                gridConfig={{
                    cols: Math.ceil(containerWidth / CellSize) - 1,
                    rowHeight: CellSize,
                    margin: [0, 0]
                }}
                dragConfig={{enabled: editMode}}
                resizeConfig={{enabled: editMode}}
                layout={layout}
                onLayoutChange={handleLayoutChange}
            >
                {widgets.map(widget => (
                    <div key={widget.name}>
                        <widget.content/>
                    </div>
                ))}
            </ReactGridLayout>}</div>
    )
}

export default function MainPage() {
    return <EditModeProvider><PageContent/></EditModeProvider>
}
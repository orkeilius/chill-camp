import {Layout} from "react-grid-layout";
import {create} from "zustand";
import {Widget} from "../interface/widget";
import {persist} from "zustand/middleware";
import {useWindowsStore} from "./WindowsStore";
import WidgetListPage from "../pages/WidgetListPage";


type WidgetsState = {
    isEditMode: boolean;
    layout: Layout;
}

type WidgetsStore = {
    toggleEditMode: (newMode?: boolean) => void
    updateLayout: (newLayout: Layout) => void
}


export const useWidgetsStore = create<WidgetsState & WidgetsStore>()(
    persist((set) => ({
        isEditMode: false,
        layout:
            [],
        toggleEditMode:
            (newMode?) => (
                set((state) => {
                    const next = newMode ?? !state.isEditMode
                    if (next) {
                        useWindowsStore.getState().create({
                            id: "widget-list",
                            title: "add widget",
                            content: WidgetListPage
                        })
                    } else {
                        useWindowsStore.getState().delete("widget-list")
                    }

                    return {isEditMode: next}
                })

            ),

        updateLayout:
            (newLayout) => {
                set(() => {
                    return {layout: newLayout}
                })
            }


    }), {
        name: "grid-layout",
        partialize: (s) => ({layout: s.layout})
        //storage: new LocalJsonStorage<WidgetsStore>()
    })
)

export function loadLayout(widgets: Map<string,Widget>): Layout {
    return Array.from(widgets.values()).map((w, i) => layoutFromWidget(w, i));
}

function layoutFromWidget(w: Widget, i: number) {
    return ({
        i: w.name,
        x: 0,
        y: i,
        w: w.minSize.width,
        h: w.minSize.height,
        minW: w.minSize.width,
        minH: w.minSize.height,
        maxW: w.maxSize.width,
        maxH: w.maxSize.height,
    });
}
import {Layout} from "react-grid-layout";
import {create} from "zustand";
import {Widget} from "../interface/widget";
import {persist} from "zustand/middleware";


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
                    return {isEditMode: next}
                })),

        updateLayout:
            (newLayout) => {
                set(() => {
                    return {layout: newLayout}
                })
            }


        }),{
        name: "grid-layout",
        partialize: (s) => ({layout: s.layout})
        //storage: new LocalJsonStorage<WidgetsStore>()
    })
)

export function loadLayout(widgets: Widget[]): Layout {
    return widgets.map((w, i) => ({
        i: w.name,
        x: 0,
        y: i,
        w: w.minSize.width,
        h: w.minSize.height,
        minW: w.minSize.width,
        minH: w.minSize.height,
        maxW: w.maxSize.width,
        maxH: w.maxSize.height,
    }));
}
import {create} from "zustand";
import {Widget} from "../interface/widget";
import {persist} from "zustand/middleware";
import {useWindowsStore} from "./WindowsStore";
import WidgetListPage from "../pages/WidgetListPage";
import {Layout, LayoutItem} from "react-grid-layout";
import {v7 as uuid} from "uuid"

type ExtendedLayoutItem = LayoutItem & {
    widget: string
}

type WidgetsState = {
    isEditMode: boolean;
    layout: Readonly<ExtendedLayoutItem[]>;
}

type WidgetsStore = {
    toggleEditMode: (newMode?: boolean) => void
    updateLayout: (newLayout: Layout) => void
    addWidget: (widget: Widget) => void
    removeWidget: (widgetName: string) => void
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
                set((state) => {
                    const fixedLayout = mergeLayouts(state.layout, newLayout)
                    console.table(fixedLayout)
                    return {layout: fixedLayout}
                })
            },

        addWidget: (widget) => {
            set((state) => {
                const item = layoutFromWidget(widget)
                return {layout: state.layout.filter(l => l.i !== widget.name).concat(item)}
            })
        },

    }), {
        name: "grid-layout",
        partialize: (s) => ({layout: s.layout})
        //storage: new LocalJsonStorage<WidgetsStore>()
    })
)

export function loadLayout(widgets: Map<string, Widget>): Layout {
    return Array.from(widgets.values()).map((w) => layoutFromWidget(w));
}

function layoutFromWidget(w: Widget): ExtendedLayoutItem {
    return ({
        widget: w.name,
        i: uuid(),
        x: 0,
        y: 0,
        w: w.minSize.width,
        h: w.minSize.height,
        minW: w.minSize.width,
        minH: w.minSize.height,
        maxW: w.maxSize.width,
        maxH: w.maxSize.height,
    });
}

function mergeLayouts(layout: Readonly<ExtendedLayoutItem[]>, newLayout: Layout): ExtendedLayoutItem[] {
    return newLayout.map((item) => {
        const existing = layout.find(l => l.i === item.i)
        return existing ? {...existing, ...item} : item as ExtendedLayoutItem
    })
}
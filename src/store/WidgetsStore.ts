import {Layout} from "react-grid-layout";
import {create} from "zustand";
import {Widget} from "../interface/widget";


type WidgetsState = {
    isEditMode: boolean;
    layout: Layout;
}

type WidgetsStore = {
    toggleEditMode: (newMode?: boolean) => void
    updateLayout: (newLayout: Layout) => void
}

const STORAGE_KEY = "grid-layout";

export const useWidgetsStore = create<WidgetsState & WidgetsStore>((set) => ({
    isEditMode: false,
    layout: [],
    toggleEditMode: (newMode?) => (
        set((state) => {
            const next = newMode ?? !state.isEditMode
            return {isEditMode: next}
        })),

    updateLayout: (newLayout) => {
        set(() => {
            return {layout: newLayout}
        })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayout));
    }

}))

export function loadLayout(widgets: Widget[]): Layout {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) throw new Error("no saved layout");
        const parsed = JSON.parse(saved);
        return parsed.map((p: any) => {
            const w = widgets.find((w) => w.name === p.i);
            return w
                ? {
                    ...p,
                    minW: w.minSize.width,
                    minH: w.minSize.height,
                    maxW: w.maxSize.width,
                    maxH: w.maxSize.height,
                }
                : p;
        });
    } catch {
        // fallback to default layout
    }
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
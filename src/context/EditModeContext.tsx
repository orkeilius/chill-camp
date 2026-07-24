import {createContext, useContext, useState, ReactNode, useMemo} from "react";
import {useWindows} from "./WindowsContext";
import WidgetListPage from "../pages/WidgetListPage";

type EditModeCtx = {
    editMode: boolean
    toggle: () => void
}

const Ctx = createContext<EditModeCtx>({
    editMode: false, toggle: () => {
    }
})

export function EditModeProvider({children}: Readonly<{ children: ReactNode }>) {
    const [editMode, setEditMode] = useState(false)
    const windowsState = useWindows();
    const toggle = () => setEditMode(v => {
        if (!v) {
            windowsState.create({
                id: "widget-list",
                title: "add widget",
                content: WidgetListPage
            })
        } else {
            windowsState.delete("widget-list")
        }
        return !v
    })

    const value = useMemo(() => ({editMode, toggle}), [editMode])

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useEditMode() {
    return useContext(Ctx)
}

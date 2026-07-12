import {createContext, useContext, useState, ReactNode, useMemo} from "react";

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
    const toggle =() => setEditMode(v => !v)
    const value = useMemo(() => ({editMode, toggle }),[editMode])

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useEditMode() {
    return useContext(Ctx)
}

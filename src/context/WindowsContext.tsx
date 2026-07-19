import {createContext, useContext, useState, useCallback, ReactNode, useMemo, ReactElement} from "react";

export type WindowConfig = {
    title: string;
    id: string;
    content: () => ReactElement;
    defaultSize?: { width: number; height: number };
    defaultPosition?: { x: number; y: number };
    isClosable?: boolean;
    minSize?: { width: number; height: number };
};

type WindowCtx = {
    create: (windowConfig: WindowConfig) => void
    delete: (id: string) => void
    value: Readonly<Map<string, WindowConfig>>
}

const Ctx = createContext<WindowCtx>({
    create: () => {
    },
    delete: () => {
    },
    value: new Map(),
});


export function WindowsProvider({children}: Readonly<{ children: ReactNode }>) {
    const [windows, setWindows] = useState<Map<string, WindowConfig>>(new Map());

    const create = useCallback((config: WindowConfig) => {

        setWindows(prev => {
            const next = new Map(prev);
            next.set(config.id, config);
            return next;
        });
    }, []);

    const delete_ = useCallback((id: string) => {
        setWindows(prev => {
            const next = new Map(prev);
            next.delete(id);
            return next;
        });
    }, []);

    const value = useMemo(() => ({
        create,
        delete: delete_,
        value: windows as Readonly<Map<string, WindowConfig>>,
    }), [create, delete_, windows]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWindows() {
    return useContext(Ctx);
}




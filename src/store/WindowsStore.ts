import {create} from "zustand";
import {ReactElement} from "react";

export type WindowConfig = {
    title: string;
    id: string;
    content: () => ReactElement;
    defaultSize?: { width: number; height: number };
    defaultPosition?: { x: number; y: number };
    isClosable?: boolean;
    minSize?: { width: number; height: number };
};

type WindowsStore = {
    value: Readonly<Map<string, WindowConfig>>;
    create: (config: WindowConfig) => void;
    delete: (id: string) => void;
};

export const useWindowsStore = create<WindowsStore>((set) => ({
    value: new Map(),
    create: (config) =>
        set((state) => {
            const next = new Map(state.value);
            next.set(config.id, config);
            return {value: next};
        }),
    delete: (id) =>
        set((state) => {
            const next = new Map(state.value);
            next.delete(id);
            return {value: next};
        }),
}));

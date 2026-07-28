import {useEffect} from "react";
import "../css/WindowManager.css";
import MainPage from "../pages/MainPage";
import WindowInstance from "./WindowInstance";
import {useWindowsStore} from "../store/WindowsStore";

export default function WindowsManager() {
    const windowsStore = useWindowsStore();
    const windows = windowsStore.value
    useEffect(() => {
        windowsStore.create({
            id: "main",
            title: "chill-camp",
            content: MainPage,
            isClosable: false
        })
    }, []);

    return (
        <div className="window-layer">
            {[...windows].map(([id, config]) => (
                <WindowInstance
                    key={id}
                    config={config}
                    onClose={() => windowsStore.delete(id)}
                />
            ))}
        </div>
    );
}


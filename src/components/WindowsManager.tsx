import {useEffect} from "react";
import {useWindows} from "../context/WindowsContext";
import "../css/WindowManager.css";
import MainPage from "../pages/MainPage";
import WindowInstance from "./WindowInstance";

export default function WindowsManager() {
    const windowsState = useWindows();
    const windows = windowsState.value
    useEffect(() => {
        windowsState.create({
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
                    onClose={() => windowsState.delete(id)}
                />
            ))}
        </div>
    );
}


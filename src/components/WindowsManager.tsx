import {useEffect} from "react";
import {useWindows} from "../context/WindowsContext";
import "../css/WindowManager.css";
import MainPage from "../pages/MainPage";
import {WindowInstance} from "./WindowInstance";

export default function WindowsManager() {
    const windowsManger = useWindows();
    const windows = windowsManger.value
    console.log(windowsManger)
    useEffect(() => {
        windowsManger.create({
            id: "main",
            title: "chill-camp",
            content: MainPage,
            isClosable: false
        })
    }, []);

    return (
        <div className="wm-layer">
            {[...windows].map(([id, config]) => (
                <WindowInstance
                    key={id}
                    config={config}
                    onClose={() => windowsManger.delete(id)}
                />
            ))}
        </div>
    );
}


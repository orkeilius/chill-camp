import {useEffect} from "react";
import MainTrackService from "./services/mainTrackService";
import WindowsManager from "./components/WindowsManager";
import {loadLayout, useWidgetsStore} from "./store/WidgetsStore";
import modService from "./services/modService";

function App() {
    const widgetsStore = useWidgetsStore();
    useEffect(() => {
        MainTrackService.start()

        if (widgetsStore.layout.length === 0) {
            widgetsStore.updateLayout(loadLayout(modService.listOfWidgets))
        }
        return () => {
            MainTrackService.stop()
        }
    }, []);


    return (
        <WindowsManager/>
    );
}

export default App;

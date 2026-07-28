import {useEffect} from "react";
import MainTrackService from "./services/mainTrackService";
import WindowsManager from "./components/WindowsManager";
import {loadLayout, useWidgetsStore} from "./store/WidgetsStore";
import modService from "./services/modService";

function App() {
    useEffect(() => {
        MainTrackService.start()

        useWidgetsStore.setState(s => ({
            value: {...s.value, layout: loadLayout(modService.listOfWidgets)}
        }));

        return () => {
            MainTrackService.stop()
        }
    }, []);



    return (
            <WindowsManager/>
    );
}

export default App;

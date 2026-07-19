import {useEffect} from "react";
import MainTrackService from "./services/mainTrackService";
import WindowsManager from "./components/WindowsManager";
import { WindowsProvider} from "./context/WindowsContext";

function App() {
    useEffect(() => {
        MainTrackService.start()
        return () => {
            MainTrackService.stop()
        }
    }, []);


    return (
        <WindowsProvider>
            <WindowsManager/>
        </WindowsProvider>
    );
}

export default App;

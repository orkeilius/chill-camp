import {useEffect} from "react";
import MainTrackService from "./services/mainTrackService";
import WindowsManager from "./components/WindowsManager";

function App() {
    useEffect(() => {
        MainTrackService.start()
        return () => {
            MainTrackService.stop()
        }
    }, []);


    return (
            <WindowsManager/>
    );
}

export default App;

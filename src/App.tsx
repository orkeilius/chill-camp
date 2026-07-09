import MainPage from "./pages/MainPage";
import {useEffect} from "react";
import MainTrackService from "./services/mainTrackService";

function App() {
    useEffect(() => {
        MainTrackService.start()
        return () => {
            MainTrackService.stop()
        }
    }, []);

    return <MainPage />;
}

export default App;

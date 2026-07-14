import { EditModeProvider } from "../context/EditModeContext";
import GridContainer from "../components/GridContainer";

export default function MainPage() {
    return (
        <EditModeProvider>
            <GridContainer />
        </EditModeProvider>
    );
}

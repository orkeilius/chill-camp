import {Widget} from "../../interface/widget";
import {useWidgetsStore} from "../../store/WidgetsStore";

export const EditWidget: Widget = {
    name: "Edit grid buttom",
    minSize: {width: 1, height: 1},
    maxSize: {width: 1, height: 1},

    content: EditWidgetContent
}

function EditWidgetContent() {
    const isEditMode = useWidgetsStore(s => s.isEditMode)
    const toggleEditMode = useWidgetsStore(s => s.toggleEditMode)

    return <button style={{
        height: "100%",
        width: "100%",
        background: isEditMode ? "red" : "green",
        cursor: "pointer"
    }} onClick={() => {toggleEditMode()}}/>
}
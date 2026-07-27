import {Widget} from "../../interface/widget";
import {useWidgetsStore} from "../../store/WidgetsStore";

export const EditWidget: Widget = {
    name: "Edit grid buttom",
    minSize: {width: 1, height: 1},
    maxSize: {width: 1, height: 1},

    content: EditWidgetContent
}

function EditWidgetContent() {
    const widgetsStore = useWidgetsStore()

    return <button style={{
        height: "100%",
        width: "100%",
        background: widgetsStore.value.isEditMode ? "red" : "green",
        cursor: "pointer"
    }} onClick={() => {widgetsStore.toggleEditMode()}}/>
}
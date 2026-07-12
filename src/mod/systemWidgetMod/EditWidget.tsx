import {Widget} from "../../interface/widget";
import {useEditMode} from "../../context/EditModeContext";

export const EditWidget: Widget = {
    name : "Edit grid buttom",
    minSize: {width: 1, height: 1},
    maxSize: {width: 1, height: 1},

    content: EditWidgetContent
}

function EditWidgetContent(){
    const {editMode, toggle} = useEditMode()

    return <button style={{height: "100%",width: "100%",  background: editMode ? "red" : "green", cursor: "pointer"}} onClick={toggle} />
}
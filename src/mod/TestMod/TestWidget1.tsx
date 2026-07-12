import {ReactElement, useState} from "react";
import {Widget} from "../../interface/widget";

export const TestWidget1: Widget = {
    name: "Test Widget 1",
    minSize: {height: 1, width: 1},
    maxSize: {height: 10, width: 10},
    content: Content

}

function Content(): ReactElement {
    const [color, _] = useState(randomColor())

    return <div style={{border: '0px solid black', background: color}}>Test Widget 1</div>;
}

function randomColor() {
    return `hsl(${Math.random() * 359}, 70%, 60%)`;
}
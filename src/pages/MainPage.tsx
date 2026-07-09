type Widget = {
    size: {
        x: number;
        y: number;
    }
    content: string;
}

import "../css/MainPage.css";

function randomColor() {
    return `hsl(${Math.random() * 360}, 70%, 60%)`;
}

const widgets: Widget[] = Array.from({ length: 2000 }, () => ({
    size: {
        x: Math.ceil(Math.random() * 5),
        y: Math.ceil(Math.random() * 5),
    },
    content: randomColor(),
}));

export default function MainPage() {
    return (<div className="grid">
        {widgets.map((widget, index) => (
            <div
                key={index}
                style={{
                    gridColumn: `span ${widget.size.x}`,
                    gridRow: `span ${widget.size.y}`,
                    backgroundColor: widget.content
                }}
            >
                {widget.content}
            </div>
        ))}
    </div>)

}

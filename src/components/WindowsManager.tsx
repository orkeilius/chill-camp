import {SyntheticEvent, useEffect, useRef, useState} from "react";
import Draggable from "react-draggable";
import {ResizableBox, ResizeCallbackData} from "react-resizable";
import {useWindows, type WindowConfig} from "../context/WindowsContext";
import "../css/WindowManager.css";
import MainPage from "../pages/MainPage";

export default function WindowsManager() {
    const windowsManger = useWindows();
    const windows = windowsManger.value
    console.log(windowsManger)
    useEffect(() => {
        windowsManger.create({
            id: "main",
            title: "chill-camp",
            content: MainPage,
            isClosable: false
        })
    }, []);

    return (
        <div className="wm-layer">
            {[...windows].map(([id, config]) => (
                <WindowInstance
                    key={id}
                    config={config}
                    onClose={() => windowsManger.delete(id)}
                />
            ))}
        </div>
    );
}

function WindowInstance({
                            config, onClose,
                        }: {
    config: WindowConfig;
    onClose: () => void;
}) {
    const [pos, setPos] = useState(
        config.defaultPosition ?? {x: 50, y: 50},
    );
    const isClosable = config.isClosable ?? true;
    const minW = config.minSize?.width ?? 200;
    const minH = config.minSize?.height ?? 80;
    const [size,setSize] = useState(config.defaultSize ?? {width: 400, height: 300});

    const correctResizePos = (event: SyntheticEvent, newSize: ResizeCallbackData) => {
        if (!newSize.handle.includes("n") && !newSize.handle.includes("w")) {
            return
        }
        setPos(
            {
                x: pos.x - (newSize.size.width - size.width),
                y: pos.y - (newSize.size.height - size.height)
            }
        )
        setSize(newSize.size)
    }

    const nodeRef = useRef(null)
    return (
        <Draggable
            position={pos}
            nodeRef={nodeRef}
            handle=".window-titlebar"
            onDrag={(_, data) => setPos({x: data.x, y: data.y})}
        >
            <div
                ref={nodeRef}>
                <ResizableBox
                    width={size.width}
                    height={size.height}
                    minConstraints={[minW, minH]}
                    onResize={correctResizePos}
                    resizeHandles={["se", "sw", "ne", "nw", "e", "w", "n", "s"]}
                    handle={(handleAxis, ref) => <div ref={ref}
                                                      className={"window-handle window-handle-" + handleAxis}/>}
                >
                    <div
                        className="window-card">
                        <div className="window-titlebar">
                            <span className="wm-titlebar-text">{config.title}</span>
                            {isClosable && (
                                <button onClick={onClose} className="wm-close-btn">
                                    ✕
                                </button>
                            )}
                        </div>
                        <div className="wm-content">
                            <config.content/>
                        </div>
                    </div>
                </ResizableBox>
            </div>
        </Draggable>
    );
}

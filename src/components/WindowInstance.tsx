import {SyntheticEvent, useRef, useState} from "react";
import {ResizableBox, ResizeCallbackData} from "react-resizable";
import Draggable from "react-draggable";
import type {WindowConfig} from "../context/WindowsContext";

type WindowInstanceProps = {
    config: WindowConfig;
    onClose: () => void;
}

export default function WindowInstance({config, onClose,}: Readonly<WindowInstanceProps>) {
    const [pos, setPos] = useState(
        config.defaultPosition ?? {x: 50, y: 50},
    );
    const isClosable = config.isClosable ?? true;
    const minW = config.minSize?.width ?? 200;
    const minH = config.minSize?.height ?? 80;
    const [size, setSize] = useState(config.defaultSize ?? {width: 400, height: 300});

    const correctResizePos = (event: SyntheticEvent, newSize: ResizeCallbackData) => {
        let newX = pos.x
        let newY = pos.y
        if (newSize.handle.includes("n")) {
            newY = pos.y - (newSize.size.height - size.height)
        }
        if (newSize.handle.includes("w")) {
            newX = pos.x - (newSize.size.width - size.width)
        }

        setPos({x: newX, y: newY})
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
                                <button onClick={onClose} className="wm-close-btn" type="button">
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

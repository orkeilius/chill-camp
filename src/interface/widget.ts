import {ReactElement} from "react";

export type Widget = {

    name: string
    minSize: {width: number, height: number}
    maxSize: {width: number, height: number}

    content: () => ReactElement

}
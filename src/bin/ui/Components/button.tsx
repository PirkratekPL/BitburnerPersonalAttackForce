const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;

const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;

export interface ButtonProps {
    onClick: () => void;
    disabled: boolean;
    text: string;
    type: ButtonType;
}

export enum ButtonType {
    Red,
    Green,
    Gold,
    Blue,
    Brown,
}

export function Button(props: ButtonProps) {
    return (
        <input
            style={GetStyle(props.type, props.disabled)}
            type='button'
            onClick={props.onClick}
            value={props.text} />
    )
}

function GetStyle(type: ButtonType, disabled: boolean): React.CSSProperties {
    let style: React.CSSProperties = {
        boxShadow: '0px 0px 2px 2px gray',
        minHeight: '20px',
        fontWeight: '900',
        margin: '2px',
    };
    switch (type) {
        case ButtonType.Blue:
            style.backgroundColor = disabled ? 'lightgray' : 'blue';
            style.color = 'lightgray';
            break;
        case ButtonType.Brown:
            style.backgroundColor = disabled ? 'lightbrown' : 'brown';
            style.color = 'lightgray';
            break;
        case ButtonType.Gold:
            style.backgroundColor = 'gold';
            break;
        case ButtonType.Green:
            style.backgroundColor = 'green';
            break;
        case ButtonType.Red:
            style.backgroundColor = 'red';
            break;
    }

    return style;
}
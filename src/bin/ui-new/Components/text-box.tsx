const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;

const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;
const { useState } = React;

export interface TextBoxProps {
    onChange: (text: string) => void;
    disabled?: boolean;
    defaultValue: string;
}

export function TextBox(props: TextBoxProps) {
    var [text, setText] = useState<string>(props.defaultValue);
    const propagateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        props.onChange(event.target.value);
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        event.stopPropagation();
    }

    return (
        <input
            style={GetStyle()}
            type='text'
            onKeyDown={handleKeyDown}
            onInput={propagateChange}
            value={text} />
    )
}

function GetStyle(): React.CSSProperties {
    let style: React.CSSProperties = {
        boxShadow: '0px 0px 2px 2px gray',
        minHeight: '20px',
        fontWeight: '900',
        margin: '2px',
        width: 'auto'
    };


    return style;
}
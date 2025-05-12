const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;
const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;
const { useState } = React;

export interface TextBoxProps {
    defaltValue: string;
    onChange: (value: string) => void;
}

export function TextBox(props: TextBoxProps) {
    const [value, setValue] = useState<string>(props.defaltValue);
    const change = (value: React.ChangeEvent<HTMLInputElement>) => {
        value.bubbles = false;
        value.stopPropagation();
        value.preventDefault();
        setValue(value.target.value);
        props.onChange(value.target.value);
    }

    return (
        <input type='text' value={value} onChange={change} />
    );
}
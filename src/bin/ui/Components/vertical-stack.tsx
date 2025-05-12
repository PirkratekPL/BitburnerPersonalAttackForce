const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;

const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;

export function VerticalStack(props) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: "column",
            }}>
                {props.children}
        </div>
    )
}

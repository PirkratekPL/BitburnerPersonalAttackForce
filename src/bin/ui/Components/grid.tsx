const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;
const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;


export function Grid(props) {
    return (
        <div style={{
            display: 'inline-grid',
            gap: '5px',
            gridTemplateColumns: 'auto auto auto',
            ...props.style
        }}>
            {props.children}
        </div>
    );
}
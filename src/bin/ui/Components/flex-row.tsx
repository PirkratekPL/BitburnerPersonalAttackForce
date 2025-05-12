const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;
const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;

export function FlexRow(props) {

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: '5px',
            }}>
            {props.children}
        </div>
    );
}
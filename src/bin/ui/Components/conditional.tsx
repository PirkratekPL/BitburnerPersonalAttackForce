const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;
const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;

export function Conditional(props: {condition: boolean, children: any}) {
    if (props.condition){
        return (<>{props.children}</>);
    }
    else return (<></>);
}
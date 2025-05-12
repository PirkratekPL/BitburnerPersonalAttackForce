
const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;
const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;
const { useState, useMemo } = React;

export function Accordeon({ name, children }) {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <AccordeonHeader 
            name={name}
            expanded={expanded}
            onClick={() => setExpanded(!expanded)}/>
            <div style={{
                display: expanded ? 'flex' : 'none',
                flexDirection: 'column',
                transition: '0.3s ease-in-out',
                height: expanded ? 'auto' : '0'
            }}>
                {children}
            </div>
        </div>
    )
}

function AccordeonHeader({name, expanded, onClick}) {
    return (
        <div style={{
            display: 'flex',
            alignContent: 'stretch',
            flexDirection: 'row',
            border: 'red 3px dotted',
        }}>
            <div style={{
                width: 'calc(100% - 32px)',
            }}>{name}</div>
            <div
                onClick={onClick}
                style={{
                    height: '32px',
                    width: '32px',
                    cursor: 'crosshair',
                }}>{expanded ? '︿' : '﹀'}</div>
        </div>
    )
}
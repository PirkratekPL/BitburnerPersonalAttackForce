import { NpcServerDetailsExpanded } from '../data-backing/glorious-dashboard';

const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;

const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;

export function ServerSelectorPanel(props: {serverDetails: NpcServerDetailsExpanded, selectedNpcServer: string | null, setSelectedServer: (serverName: string | null) => void}) {
    const selectServer = () => props.setSelectedServer(props.serverDetails.server);

        return (
        <div 
            style={{
                border: '3px ' + (props.selectedNpcServer === props.serverDetails.server ? 'dotted ' : 'solid ') + (props.serverDetails.isExploited? 'green' : props.serverDetails.hasRoot ? 'yellow' : 'red')
            }}
            onClick={selectServer}>
            {props.serverDetails.server}
        </div>
    )
}
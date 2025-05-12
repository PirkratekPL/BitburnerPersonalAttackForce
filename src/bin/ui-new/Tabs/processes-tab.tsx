import { NS } from '../../bitburner';
import { Button, ButtonType } from '../Components/button';
import { getProcessesData, ProcessDetails, ProcessesTabDataModel } from './processes-tab-logic';

const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;

const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;
const { useState, useEffect, useMemo, createElement, lazy } = React;

export function ProcessesTab(props: {ns: NS}) {
    const [data, setData] = useState<ProcessesTabDataModel>();
    const [selectedServer, setSelectedServer] = useState<string>();
    const [detailsList, setDetailsList] = useState<ProcessDetails[]>();

    const refreshData = () => {
        getProcessesData(props.ns).then(x => {
            setData(x);
            if (!!selectedServer) selectServer(selectedServer);
        });
    }

    const selectServer = (server: string) => {
        setSelectedServer(server);
        setDetailsList(data?.serversWithProcesses[server]);
    }

    useEffect(refreshData, []);
    return (
    <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            border: '3px solid yellow',
        }}>
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                flexBasis: '100px',
                minWidth: '50px',
                maxWidth: '150px',
            }}>
            <Button onClick={refreshData} text='REFRESH' type={ButtonType.Blue} />
            {!!data && 
                Object.keys(data.serversWithProcesses).map(server => <Button onClick={() => selectServer(server)} text={server} type={ selectedServer === server ? ButtonType.Red : ButtonType.Green } />)}
        </div>
        {!!detailsList && 
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'scroll',
                    border: '3px solid norris'
                }}>
            {detailsList.map(d => <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 5,
                border: '3px solid fellatio',
            }}>
                <p>FileName: {d.fileName}</p>
                <p>args: {`[${d.args.join(', ')}]`}</p>
                <p>PID: {d.pid}</p>
                <p>threads: {d.threads}</p>
                <p>used RAM: {props.ns.formatRam(d.usedRam)}</p>
            </div>)}
        </div>}
    </div>)
}
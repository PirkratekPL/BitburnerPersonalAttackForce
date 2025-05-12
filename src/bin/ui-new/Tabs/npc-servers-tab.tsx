import { NS } from '../../bitburner';
import { inputIntoTerminal } from '../../utils/input-into-terminal';
import { Button, ButtonType } from '../Components/button';
import { TextBox } from '../Components/text-box';
import { getNpcServersData, NpcServerDetailsExpanded, NpcServersTabDataModel } from './npc-servers-tab-logic';

const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;

const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;
const { useState, useEffect } = React;

export interface NpcServersTabProps {
    ns: NS;
}

export function NpcServersTab(props: NpcServersTabProps) {
    const [selectedServer, setSelectedServer] = useState<string>();
    const [data, setData] = useState<NpcServersTabDataModel>();
    const [details, setDetails] = useState<NpcServerDetailsExpanded>();
    const [hackThreads, setHackThreads] = useState<number>(400);

    const selectServer = (server: string) => {
        setSelectedServer(server);
        setDetails(data?.serverDetails.find(x => x.server === server));
    }
    const refreshData = () => {
        getNpcServersData(props.ns).then(x => {
            setData(x);
            if (!!selectedServer) selectServer(selectedServer);
        });
    }
    const serverConnect = () => {
        inputIntoTerminal(`home;con ${selectedServer}`);
    }
    const crackNukeBackdoor = () => {
        inputIntoTerminal('cnb');
    }

    const hackServer = () => {
        inputIntoTerminal(`hls -t ${hackThreads} --target ${selectedServer}`);
    }

    const changeText = (text: string) => {
        let num = Number.parseInt(text);
        if (!Number.isNaN(num))
            setHackThreads(num);
    }

    useEffect(refreshData, []);
    return (
    <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 5,
            border: '3px solid pink',
            padding: '3px',
        }}>
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                flexBasis: '100px',
                border: '3px solid gray',
                overflow: 'scroll',
            }}>
                <Button onClick={refreshData} text='REFRESH' type={ButtonType.Blue} />
                {!!data &&
                    data.serverDetails.sort(x => x.minSec).map(x =>
                    <Button onClick={() => {selectServer(x.server)}} text={x.server} type={
                        x.server === selectedServer ? ButtonType.Red
                        : x.isExploited ? ButtonType.Purple
                        : x.hasRoot ? ButtonType.Green : ButtonType.Brown
                    }/>)
                }
        </div>
        {selectedServer && !!details &&
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 5,
                border: '3px solid magenta',
                padding: '3px',
            }}>
            <div>
                <h4>{details.server}</h4>
                <p>hack level: {details.hackLevel}</p>
                <p>RAM: {`${props.ns.formatRam(details.ram.used)} / ${props.ns.formatRam(details.ram.total)} : ${Number.isNaN(details.ram.used / details.ram.total) ? '0%' : props.ns.formatPercent(details.ram.used / details.ram.total, 2)}`}</p>
                <p style={{color: details.hasRoot ? 'green' : 'red'}}>root: {details.hasRoot ? 'true' : 'false'}</p>
                <p>money: {`$${props.ns.formatNumber(details.money.current)} / $${props.ns.formatNumber(details.money.max)} : ${Number.isNaN(details.money.current / details.money.max) ? '0%' : props.ns.formatPercent(details.money.current / details.money.max, 2)}`}</p>
                <p>exploited: {details.isExploited ? 'true' : 'false'}</p>
                <p>security: {`${details.minSec} / ${details.sec}`}</p>
                <p>ports required: {`${details.portsRequired}`}</p>
                <p>hack time: {details.currentHackTime}</p>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    flexGrow: 0.1,
                    border: '3px solid cyan',
                    gap: '3px',
                }}>
                    <Button onClick={serverConnect} text='Connect' type={ButtonType.Blue} />
                    <Button onClick={crackNukeBackdoor} text='CNB' type={ButtonType.Red} />
                    <Button onClick={hackServer} text='Hack' type={ButtonType.Gold} />
                    <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '90px',
                        border: '3px solid gold'
                    }}>{props.ns.formatRam(hackThreads * 2.2)}
                        <TextBox defaultValue='400' onChange={changeText}/>
                    </div>
                </div>
        </div>}
    </div>);
}
import { Button, ButtonType } from '../Components/button';
import { Conditional } from '../Components/conditional';
import { FlexRow } from '../Components/flex-row';
import { TextBox } from '../Components/text-box';
import { VerticalStack } from '../Components/vertical-stack';
import { inputIntoTerminal } from '../../utils/input-into-terminal';

const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;
const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;
const { useState } = React

export interface ActionDashboardProps {
    refreshData: () => Promise<void>;
    refreshing: boolean;
    selectedNpcServer: string | null;
    setSelectedNpcServer: (serverName: string | null) => void;
    selectedPlayerServer: string | null;
    setSelectedPlayerServer: (serverName: string | null) => void;
}

export function ActionDashboard(props: ActionDashboardProps) {
    let [threadsInput, setThreadsInput] = useState<string>('');
    const goHome = () => inputIntoTerminal('home');
    const setThreads = (value: string) => {
        setThreadsInput(value);
    }
    const clearSelection = () => {
        props.setSelectedNpcServer(null);
        props.setSelectedPlayerServer(null);
    }
    const refreshStorage = () => inputIntoTerminal('rebuild-info');
    const refreshData = () => props.refreshData();
    const hlsServer = () => inputIntoTerminal(`hls -t ${threadsInput} --target ${props.selectedNpcServer}`);
    const connect = () => inputIntoTerminal(`home;con ${props.selectedNpcServer}`);
    const cnb = () => inputIntoTerminal('cnb');
    const bth = () => inputIntoTerminal('best-to-hack');
    const buyAll = () => inputIntoTerminal('buyAll');


    return (
        <>
            <VerticalStack>
                <FlexRow
                    style={{
                        width: '100%',
                        height: 'auto',
                        border: '3px dotted green',
                        padding: '5px',
                    }}>
                    {props.selectedNpcServer}, {props.selectedPlayerServer}
                </FlexRow>
                <FlexRow
                    style={{
                        width: '100%',
                        height: 'auto',
                        border: '3px dotted green',
                        padding: '5px',
                    }}>
                    <Button type={ButtonType.Blue} text='Home' disabled={false} onClick={goHome}></Button>
                    <Button type={ButtonType.Red} text='Clear' disabled={false} onClick={clearSelection}></Button>
                    <Button type={ButtonType.Brown} text='Ref Data' disabled={props.refreshing} onClick={refreshData}></Button>
                    <Button type={ButtonType.Green} text='Connect' disabled={false} onClick={connect}></Button>
                    <Button type={ButtonType.Red} text='CNB' disabled={false} onClick={cnb}></Button>
                    <Conditional condition={props.refreshing}>
                        {'refreshing'}
                        <div style={{ backgroundColor: 'purple', height: '20px', width: '20px'}}></div>
                    </Conditional>
                </FlexRow>
                <FlexRow
                    style={{
                        width: '100%',
                        height: 'auto',
                        border: '3px dotted green',
                        padding: '5px',
                    }}>
                    <Button type={ButtonType.Blue} text='BTH' disabled={false} onClick={bth}></Button>
                    <Button type={ButtonType.Blue} text='BuyAll' disabled={false} onClick={buyAll}></Button>
                    <Button type={ButtonType.Brown} text='Ref Storage' disabled={false} onClick={refreshStorage}></Button>
                </FlexRow>
                <FlexRow
                    style={{
                        width: '100%',
                        height: 'auto',
                        border: '3px dotted green',
                        padding: '5px',
                    }}>
                    <Button type={ButtonType.Gold} text='HLS' disabled={false} onClick={hlsServer}></Button>
                    <TextBox defaltValue='4000' onChange={setThreads}/>
                </FlexRow>
            </VerticalStack>
        </>
    );
}
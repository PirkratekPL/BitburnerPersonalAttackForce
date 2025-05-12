import { Button, ButtonType } from './button';

const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;

const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;
const { useState, useMemo } = React;

export interface HorizontalTabsProps {
    tabs: { [tabName: string]: React.JSX.Element };
    useButtonContainer?: boolean;
    leftButtons?: React.JSX.Element[];
}

export function HorizontalTabs(props: HorizontalTabsProps) {
    var [selectedTab, setSelectedTab] = useState<string | null>();
    var [showButtonContainer, setUseButtonContainer] = useState<boolean>(!!props.useButtonContainer);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 1,
                border: '3px blue solid',
                boxSizing: 'border-box',
                padding: '3px',
                minHeight: '500px',
                gap: '3px',
                maxHeight: '500px',
            }}>

            {showButtonContainer && !!props.leftButtons &&
            <div 
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                flexBasis: '100px',
                border: '3px solid purple',
                padding: '3px',
            }}>
                {props.leftButtons.map(element => element)}
            </div>}
            
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    flex: '1 1 100px',
                    maxWidth: '150px',
                    minWidth: '100px',
                    border: '3px solid red',
                    padding: '3px',
                }}>
                {Object.keys(props.tabs).map(key => <Button onClick={() => setSelectedTab(key)} text={key} type={key === selectedTab ? ButtonType.Red : ButtonType.Green} />)}
            </div>
            <div
                style={{
                    border: '3px solid yellow',
                    flexGrow: '5',
                    display: 'flex',
                    padding: '3px'
                }}>
                {selectedTab && props.tabs[selectedTab]}
            </div>
        </div>
    )
}

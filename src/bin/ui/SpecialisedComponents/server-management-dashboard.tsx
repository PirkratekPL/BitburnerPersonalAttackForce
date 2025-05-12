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
    selectedPlayerServer: string | null;
}

export function ServerManagementDashboard(props) {
    const buyServer = () => {}

    return (<VerticalStack>
        <FlexRow>
            <Button type={ButtonType.Blue} text='Buy Server' disabled={false} onClick={buyServer}></Button>
        </FlexRow>
    </VerticalStack>);
}
import { NS } from '../../bitburner';
import { Button, ButtonType } from '../Components/button';
import { HorizontalTabs } from '../Components/horizontal-tabs';

const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;

const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;
const { useState, useEffect } = React;

export function PlayerServersTab(props: { ns: NS }) {

    let tabs = {
        'Buy new server': <></>
    }

    return (<HorizontalTabs tabs={tabs} useButtonContainer={false} />);
}
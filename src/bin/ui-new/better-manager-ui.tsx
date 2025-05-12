import { NS } from '../bitburner'
import { inputIntoTerminal } from '../utils/input-into-terminal';
import { Button, ButtonType } from './Components/button';
import { HorizontalTabs } from './Components/horizontal-tabs';
import { NpcServersTab } from './Tabs/npc-servers-tab';
import { PlayerServersTab } from './Tabs/player-servers-tab';
import { ProcessesTab } from './Tabs/processes-tab';

const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;

const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;
const { useState, useMemo, createElement, lazy } = React;

export async function main(ns: NS) {
    let loop = true;
    ns.atExit(() => loop = false);
    ns.ui.openTail();
    ns.ui.resizeTail(900, 535);
    ns.clearLog();
    ns.disableLog('disableLog');
    ns.disableLog('asleep');
    ns.disableLog('exec');
    ns.printRaw(WrapperFunction({ns: ns}));
    while (loop) {
        await ns.asleep(1000);
    }
}

function WrapperFunction(props: {ns: NS}) {
    return (<BetterManagerDashboard ns={props.ns}/>);
}

export function BetterManagerDashboard(props: { ns: NS }) {

    var contentTabs = {
        'Npc servers': <NpcServersTab ns={props.ns}/>,
        'Player servers': <PlayerServersTab ns={props.ns} />,
        'Proceses': <ProcessesTab ns={props.ns} />,
        'Files': <></>,
        'Coding Contracts': <></>,
    }

    const goHomeYouAreDrunkButtonHandler = () => {
        inputIntoTerminal('home');
    }
    const buyAllButtonHandler = () => {
        inputIntoTerminal('buyAll');
    }

    const bestToHackButtonHandler = () => {
        inputIntoTerminal('best-to-hack');
    }

    const rebuildInfoButtonHandler = () => {
        inputIntoTerminal('rebuild-info');
    }

    const scpToAllButtonHandler = () => {

    }

    const clearPorts = () => {
        props.ns.exec('/bin/proxy/clear-ports.js', 'home');
    }

    const IPvGoMakeMove = () => {
        props.ns.exec('/bin/world/IPvGO/play-match.js', 'home');
    }

    var buttons = [
        <Button onClick={goHomeYouAreDrunkButtonHandler} text='Home' type={ButtonType.Blue} />,
        <Button onClick={buyAllButtonHandler} text='BuyAll' type={ButtonType.Red} />,
        <Button onClick={bestToHackButtonHandler} text='best-to-hack' type={ButtonType.Gold} />,
        <Button onClick={rebuildInfoButtonHandler} text='rebuild info' type={ButtonType.Brown} />,
        <Button onClick={clearPorts} text='Clear Ports' type={ButtonType.Red} />,
        <Button onClick={scpToAllButtonHandler} text='copy /bin' type={ButtonType.Purple} />,
        <Button onClick={IPvGoMakeMove} text='IPvGO' type={ButtonType.Purple} />,
    ];

    return (<HorizontalTabs tabs={contentTabs} useButtonContainer={true} leftButtons={buttons}/>);
}
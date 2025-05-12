import { NS } from '../bitburner';
import { Accordeon } from './Components/accordeon';
import { Grid } from './Components/grid';
import { VerticalStack } from './Components/vertical-stack';
import { GloriousDashboardDataModel, refreshData } from './data-backing/glorious-dashboard';
import { ActionDashboard } from './SpecialisedComponents/action-dashboard';
import { ServerManagementDashboard } from './SpecialisedComponents/server-management-dashboard';
import { ServerSelectorPanel } from './SpecialisedComponents/server-selector-panel';

const cheatyWindow = eval("window") as Window & typeof globalThis;
const cheatyDocument = eval("document") as Document & typeof globalThis;

const React = cheatyWindow.React;
const ReactDOM = cheatyWindow.ReactDOM;
const { useState, useMemo } = React;

export async function main(ns: NS) {
    ns.tail();
    ns.clearLog();
    ns.disableLog('disableLog');
    ns.disableLog('asleep');
    ns.disableLog('exec');
    var data = await refreshData(ns);
    ns.printRaw(WrapperComponent({ns, data}));
    while (true) {
        await ns.asleep(1000);
    }
}

function WrapperComponent(props: {ns: NS, data: GloriousDashboardDataModel}) {
    return (<GloriousDashboard data={props.data} ns={props.ns}/>)
}

export function GloriousDashboard(props: {ns: NS, data: GloriousDashboardDataModel}) {
    const [selectedNpcServer, setSelectedNpcServer] = useState<string | null>(null);
    const [selectedPlayerServer, setSelectedPlayerServer] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const refreshBoardData = async () => {
        try {
            setRefreshing(true);
            props.data = await refreshData(props.ns);
        } finally {
            setRefreshing(false);
        }
    }

    /* structure:
        1. input menu on top allows action execution and selected server
        2. enemy servers -> list of npc servers color coded with border: { red: unexploited but exploitable, green: exploited, teal: not rooted not-exploitable; dark-green: rooted non-exploitable }
        3. ally servers -> list of player servers with RAM usage data, level(of upgrade max. 20), next level upgrade cost
        4. some core information: like is storage running
        * each server is selectable by clicking it's name,
        * depending on server selection the input menu is modified (enable/disable some options)
    */
    return (
        <VerticalStack>
            <ActionDashboard
                selectedNpcServer={selectedNpcServer}
                setSelectedNpcServer={setSelectedNpcServer}
                selectedPlayerServer={selectedPlayerServer}
                setSelectedPlayerServer={setSelectedPlayerServer}
                refreshData={refreshBoardData}
                refreshing={refreshing}>
            </ActionDashboard>
            <Accordeon name='NpcServers'>
                <Grid>
                    {props.data.serverDetails.filter(x => x.server != 'home' && !x.server.startsWith('myServer')).map(element => (
                        <ServerSelectorPanel selectedNpcServer={selectedNpcServer} setSelectedServer={setSelectedNpcServer} serverDetails={element} />
                    ))}
                </Grid>
            </Accordeon>
            <ServerManagementDashboard></ServerManagementDashboard>
            <Accordeon name="PlayerServers">
                <Grid>
                    {props.data.serverDetails.filter(x => x.server == 'home' || x.server.startsWith('myServer')).map(element => (
                        <ServerSelectorPanel selectedNpcServer={selectedPlayerServer} setSelectedServer={setSelectedPlayerServer} serverDetails={element} />
                    ))}
                </Grid>
            </Accordeon>
        </VerticalStack>
    );
};


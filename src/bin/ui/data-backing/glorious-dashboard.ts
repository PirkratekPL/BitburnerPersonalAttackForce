import { NS } from '../../bitburner';
import { StorageKeys } from '../../db/storage-keys';
import { StorageUtils } from '../../db/storage-utils';
import { pFunc } from '../../proxy/proxy-helper';
import { ServerDetails } from '../../world/server-detailed-scanner';

export interface GloriousDashboardDataModel {
    servers: string[];
    serverDetails: NpcServerDetailsExpanded[];
}

export interface NpcServerDetailsExpanded {
    server: string;
    ram: RamDetails;
    money: MoneyDetails;
    sec: number;
    minSec: number;
    WTminSec: string;
    isExploited: boolean;
    hasRoot: boolean;
}
export interface ActiveProcess {
    name: string;
    args: string[];
    threads: number;
    ramUsed: number;
    serverName: string;
}
export class RamDetails {
    public constructor(public used: number, public total: number) { }
    public getPercentage() { return this.used / this.total; }
    public toString() { return `${this.used} / ${this.total} ${this.getPercentage() * 100}%` }
}

export class MoneyDetails {
    public constructor(public current: number, public max: number) { }
    public getPercentage() { return this.current / this.max; }
    public toString() { return `${this.current} / ${this.max} ${this.getPercentage() * 100}%` }
}

export async function refreshData(ns: NS): Promise<GloriousDashboardDataModel> {
    var servers = await StorageUtils.GetObject(ns, StorageKeys.ServerDetailsList) as ServerDetails[];
    var serversDetails: { [key: string]: NpcServerDetailsExpanded } = {};
    var activeProcesses = getAllActiveProcesses(ns);
    for (let i = 0; i < servers.length; ++i) {
        let server = servers[i];
        serversDetails[server.serverName] = {
            server: server.serverName,
            minSec: server.minDifficulty,
            money: new MoneyDetails(await pFunc<number>(ns, 'getServerMoneyAvailable', `'${server.serverName}'`), server.moneyMax),
            ram: new RamDetails(await pFunc<number>(ns, 'getServerUsedRam', `'${server.serverName}'`), server.installedRAM),
            sec: await pFunc<number>(ns, 'getServerSecurityLevel', `'${server.serverName}'`),
            WTminSec: ns.tFormat(await pFunc<number>(ns, 'getHackTime', `'${server.serverName}'`)),
            isExploited: activeProcesses.findIndex(x => x.args.includes(server.serverName)) >= 0,
            hasRoot: await pFunc<boolean>(ns, 'hasRootAccess', `'${server.serverName}'`),
        }
    }
    return {
        servers: Object.keys(serversDetails),
        serverDetails: Object.values(serversDetails),
    }
}

function getAllActiveProcesses(ns: NS): ActiveProcess[] {
    let playerServers: string[] = ['home', ...ns.getPurchasedServers()];
    return playerServers.flatMap((server) => {
        let scripts = ns.ps(server);
        return scripts.map(script => <ActiveProcess>{
            name: script.filename,
            args: script.args,
            ramUsed: ns.getScriptRam(script.filename) * script.threads,
            serverName: server,
            threads: script.threads,
        });
    });
}
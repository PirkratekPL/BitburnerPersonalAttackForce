import { NS, ProcessInfo } from '../../bitburner';
import { StorageKeys } from '../../db/storage-keys';
import { StorageUtils } from '../../db/storage-utils';
import { pFunc } from '../../proxy/proxy-helper';
import { ServerDetails } from '../../world/server-detailed-scanner';

export interface NpcServersTabDataModel {
    servers: string[];
    serverDetails: NpcServerDetailsExpanded[];
}

export interface NpcServerDetailsExpanded {
    server: string;
    ram: RamDetails;
    money: MoneyDetails;
    sec: number;
    minSec: number;
    currentHackTime: string;
    isExploited: boolean;
    hasRoot: boolean;
    portsRequired: number;
    hackLevel: number;
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

export async function getNpcServersData(ns: NS): Promise<NpcServersTabDataModel> {
    var servers = await StorageUtils.GetObject(ns, StorageKeys.ServerDetailsList) as ServerDetails[];
    servers = servers.filter(x => x.serverName !== 'home' && !x.serverName.startsWith('myserver'));
    var serversDetails: { [key: string]: NpcServerDetailsExpanded } = {};
    var activeProcesses = await getAllActiveProcesses(ns);
    for (let i = 0; i < servers.length; ++i) {
        let server = servers[i];
        serversDetails[server.serverName] = {
            server: server.serverName,
            minSec: server.minDifficulty,
            money: new MoneyDetails(await pFunc<number>(ns, 'getServerMoneyAvailable', `'${server.serverName}'`), server.moneyMax),
            ram: new RamDetails(await pFunc<number>(ns, 'getServerUsedRam', `'${server.serverName}'`), server.installedRAM),
            sec: await pFunc<number>(ns, 'getServerSecurityLevel', `'${server.serverName}'`),
            currentHackTime: ns.tFormat(await pFunc<number>(ns, 'getHackTime', `'${server.serverName}'`)),
            isExploited: activeProcesses.findIndex(x => x.args.includes(server.serverName)) >= 0,
            hasRoot: await pFunc<boolean>(ns, 'hasRootAccess', `'${server.serverName}'`),
            portsRequired: server.numOpenPortsRequired,
            hackLevel: server.hackDifficulty,
        }
    }
    return {
        servers: Object.keys(serversDetails),
        serverDetails: Object.values(serversDetails),
    }
}

async function getAllActiveProcesses(ns: NS): Promise<ActiveProcess[]> {
    let playerServers: string[] = ['home', ... await pFunc<string[]>(ns, 'getPurchasedServers')];
    var b = playerServers.flatMap(async (server) => {
        let scripts = await pFunc<ProcessInfo[]>(ns, 'ps', "'" + server + "'");
        var asyncMap = scripts.map(async script => <ActiveProcess>{
            name: script.filename,
            args: script.args,
            ramUsed: await pFunc<number>(ns, 'getScriptRam', "'" + script.filename + "'") * script.threads,
            serverName: server,
            threads: script.threads,
        });
        var nani = await Promise.all(asyncMap);
        return nani;
    });

    return (await Promise.all(b)).flat();
}
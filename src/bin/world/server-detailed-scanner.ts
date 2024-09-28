import { NS } from '../bitburner';
import { StorageKeys } from '../db/storage-keys';
import { StorageUtils } from '../db/storage-utils';

export async function main(ns: NS) {
    var serverList: string[] = await StorageUtils.GetObject(ns, StorageKeys.ServerList);
    var detailedList: ServerDetails[] = [];

    serverList.forEach(serverName => {
        var server = ns.getServer(serverName)
        detailedList.push(<ServerDetails>{
            serverName: serverName,
            backdoorInstalled: server.backdoorInstalled,
            cpuCores: server.cpuCores,
            openPortCount: server.openPortCount ?? 0,
            hackDifficulty: server.hackDifficulty ?? -1,
            minDifficulty: server.minDifficulty ?? 1,
            hasAdminRights: server.hasAdminRights,
            moneyMax: server.moneyMax ?? 0,
            serverGrowth: server.serverGrowth ?? 1,
            numOpenPortsRequired: server.numOpenPortsRequired ?? 0,
            requiredHackingSkill: server.requiredHackingSkill ?? 1,
            installedRAM: server.maxRam,
        })
    });

    await StorageUtils.PutObject(ns, StorageKeys.ServerDetailsList, detailedList);
}

export interface ServerDetails {
    serverName: string;
    backdoorInstalled: boolean;
    cpuCores: number;
    openPortCount: number;
    hackDifficulty: number;
    minDifficulty: number;
    hasAdminRights: boolean;
    moneyMax: number;
    serverGrowth: number;
    numOpenPortsRequired: number;
    requiredHackingSkill: number;
    installedRAM: number;
}
import { NS } from '../../bitburner';
import { StorageKeys } from '../../db/storage-keys';
import { StorageUtils } from '../../db/storage-utils';
import { PortUtils } from '../../ports/port-utils';
import { ServerDetails } from '../server-detailed-scanner';

export async function main(ns: NS) {
    var details = await StorageUtils.GetObject(ns, StorageKeys.ServerDetailsList) as ServerDetails[];
    var playerHackLevel = ns.getHackingLevel();
    var filtered = details.filter((x) => filterPredicate(x, playerHackLevel)).sort(sortFunc);
    for (let i = 0; i < 10 && i < filtered.length; ++i) {
        var server = filtered[i];
        ns.tprintRaw(`${server.serverName} || hackLevel: ${server.requiredHackingSkill} || maxMoney: ${server.moneyMax} || coeff: ${server.moneyMax / server.requiredHackingSkill}`);
    }
}

function filterPredicate(server: ServerDetails, playerHackLevel: number): boolean {
    return server.hasAdminRights && server.moneyMax > 0 && server.requiredHackingSkill * 2 <= playerHackLevel;
}

function sortFunc(a: ServerDetails, b: ServerDetails): number {
    return (b.moneyMax / b.minDifficulty) - (a.moneyMax / a.minDifficulty);
}
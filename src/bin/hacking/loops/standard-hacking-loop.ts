import { NS } from '../../bitburner';
import { StorageKeys } from '../../db/storage-keys';
import { StorageUtils } from '../../db/storage-utils';
import { ServerDetails } from '../../world/server-detailed-scanner';

export async function main(ns: NS) {
    var flags = ns.flags([
        ['target', '']
    ]);

    var target = flags['target'] as string;


    await jobLoop(ns, target);
}


async function jobLoop(ns: NS, target: string): Promise<never> {
    var details = (await StorageUtils.GetObject(ns, StorageKeys.ServerDetailsList)) as ServerDetails[]
    var serverDetails = details.find(x => x.serverName == target);
    if (!serverDetails) throw new Error('Missing server details in storage');
    
    while (true) {
        var securityLevel = ns.getServerSecurityLevel(target);
        if (serverDetails.minDifficulty < securityLevel) {
            await ns.weaken(target);
            continue;
        }

        var moneyAvailable = ns.getServerMoneyAvailable(target);
        if (serverDetails.moneyMax > moneyAvailable) {
            await ns.grow(target);
            continue;
        }

        await ns.hack(target);
    }
}
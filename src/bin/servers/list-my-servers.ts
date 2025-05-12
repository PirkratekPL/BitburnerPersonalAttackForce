import { NS, Server } from '../bitburner';
import { StorageUtils } from '../db/storage-utils';

export async function main(ns: NS) {
    var servers = await StorageUtils.GetObject(ns, 'ServerList') as string[];
    var myServers = servers.filter(x => x.startsWith('myServer'));
    var serversInfo = myServers.map(serverName => ns.getServer(serverName));

    serversInfo.forEach(server => {
        ns.tprintRaw(`${server.hostname} || ${ns.formatRam(server.ramUsed)} / ${ ns.formatRam(server.maxRam) } ${ server.ramUsed / server.maxRam * 100 }% || ${getUpgradeCost(ns, server)}`)
    });
    ns.tprintRaw(`New server 16GB cost: ${ns.formatNumber(ns.getPurchasedServerCost(16))}`);
}

function getUpgradeCost(ns: NS, server: Server): string {
    let isMaxed = server.maxRam >= 1048576;
    if (isMaxed) {
        return "MAXED";
    }

    return ns.formatNumber(ns.getPurchasedServerUpgradeCost(server.hostname, server.maxRam * 2));
}
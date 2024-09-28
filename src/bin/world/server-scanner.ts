import { NS } from '../bitburner';
import { StorageKeys } from '../db/storage-keys';
import { StorageUtils } from '../db/storage-utils';

export async function main(ns: NS) {
    var servers = ['home'];

    var index = 0;
    do {
        ns.print(servers);
        ns.print(`Index: ${index}`);
        var scanResult = ns.scan(servers[index]);
        scanResult.forEach(serverEntry => {
            if (!servers.find(x => x === serverEntry)) {
                servers.push(serverEntry);
            }
        });
        index += 1;
    } while (index < servers.length);

    await StorageUtils.PutObject(ns, StorageKeys.ServerList, servers);
}
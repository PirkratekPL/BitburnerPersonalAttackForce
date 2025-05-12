import { NS } from '../bitburner';
import { StorageKeys } from '../db/storage-keys';
import { StorageUtils } from '../db/storage-utils';

export async function main(ns: NS) {
    var servers = await StorageUtils.GetObject(ns, StorageKeys.ServerList) as string[];
    var ps = servers.flatMap(x => ns.ps(x));
    var lp = 1;
    ps.forEach(process => {
        ns.tprintRaw(`${lp}: ${process.filename} -t ${process.threads} || PID:${process.pid} || RAM:${ns.formatRam(ns.getScriptRam(process.filename) * process.threads)} ||`);
        lp++;
    });
}

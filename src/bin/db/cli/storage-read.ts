import { NS } from '../../bitburner';
import { StorageUtils } from '../storage-utils';

export async function main(ns: NS) {
    var flags = ns.flags([
        ['key', ''],
    ]);
    var key = flags['key'] as string;
    ns.tprint((await StorageUtils.GetObject(ns, key)));
}
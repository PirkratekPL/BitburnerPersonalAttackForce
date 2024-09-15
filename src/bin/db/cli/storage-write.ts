import { NS } from '../../bitburner';
import { StorageUtils } from '../storage-utils';

export async function main(ns: NS) {
    var flags = ns.flags([
        ['key', ''],
        ['value', ''],
    ]);
    var key = flags['key'] as string;
    var value = flags['value'] as string;
    await StorageUtils.PutObject(ns, key, value);
}
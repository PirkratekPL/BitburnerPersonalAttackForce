import { NS } from '../../buitburner';

export async function main(ns: NS) {
    await ns.weaken(ns.args[0] as string);
}
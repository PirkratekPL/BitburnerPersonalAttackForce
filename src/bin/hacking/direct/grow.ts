import { NS } from '../../bitburner';

export async function main(ns: NS) {
    await ns.grow(ns.args[0] as string);
}
import { NS } from '../bitburner';

export function main(ns: NS) {
    var port = ns.args[0] as number;
    ns.clearPort(port);
}
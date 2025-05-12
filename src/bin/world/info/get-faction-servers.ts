import { NS } from '../../bitburner';

export function main(ns: NS) {
    var factionServers = [
        'CSEC',
        'avmnite-02h',
        'run4theh111z',
        '.',
        'TheCave',
    ];

    ns.tprintRaw(factionServers.join('\n'));
}
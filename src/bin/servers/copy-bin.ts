import { NS } from '../bitburner';

export function main(ns: NS) {
    let servers = ns.getPurchasedServers();
    let files = ns.ls('home', '/bin/');
    servers.forEach(server => {
        ns.scp(files, server, "home");
    });
}
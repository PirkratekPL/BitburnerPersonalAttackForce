import { NS } from '../bitburner';
import { StorageKeys } from '../db/storage-keys';
import { StorageUtils } from '../db/storage-utils';
import { pFunc } from '../proxy/proxy-helper';
import { ServerDetails } from './server-detailed-scanner';
import { ServerTreeNode } from './server-tree-node.model';

const settings = {
    fileNames: {
        BruteSSH: 'BruteSSH.exe',
        FTPCrack: 'FTPCrack.exe',
        relaySMTP: 'relaySMTP.exe',
        HTTPWorm: 'HTTPWorm.exe',
        SQLInject: 'SQLInject.exe',
    }
}

var serverDetails: ServerDetails[];
var hasSsh: boolean;
var hasFtp: boolean;
var hasSmtp: boolean;
var hasHttp: boolean;
var hasSql: boolean;
var crackersCount: number;

export async function main(ns: NS) {
    ns.tail();
    ns.disableLog('disableLog');
    ns.disableLog('exec');
    ns.disableLog('asleep');
    
    await checkCrackers(ns);
    
    var root = (await StorageUtils.GetObject(ns, StorageKeys.ServersTree)) as ServerTreeNode;
    serverDetails = (await StorageUtils.GetObject(ns, StorageKeys.ServerDetailsList)) as ServerDetails[];
    await recursiveNukeServers(ns, root);
}

async function checkCrackers(ns: NS) {
    hasSsh = await pFunc<boolean>(ns, 'fileExists', `'${settings.fileNames.BruteSSH}'`, `'home'`);
    hasFtp = await pFunc<boolean>(ns, 'fileExists', `'${settings.fileNames.FTPCrack}'`, `'home'`);
    hasSmtp = await pFunc<boolean>(ns, 'fileExists', `'${settings.fileNames.relaySMTP}'`, `'home'`);
    hasHttp = await pFunc<boolean>(ns, 'fileExists', `'${settings.fileNames.HTTPWorm}'`, `'home'`);
    hasSql = await pFunc<boolean>(ns, 'fileExists', `'${settings.fileNames.SQLInject}'`, `'home'`);
    crackersCount = (+hasSsh) + (+hasFtp) + (+hasSmtp) + (+hasHttp) + (+hasSql);
    ns.print(`Crackers owned: ${crackersCount}`);
}

async function recursiveNukeServers(ns: NS, node: ServerTreeNode): Promise<void> {
    let details = serverDetails.find(srv => srv.serverName === node.serverName);
    if (details!.hasAdminRights === false && node.serverName !== 'home') {
        await crackServer(ns, node.serverName);
        if (details!.numOpenPortsRequired <= crackersCount) await pFunc<void>(ns, 'nuke', `'${node.serverName}'`);
    }

    ns.print(`On: ${node.serverName}; admin: ${details?.hasAdminRights}; Children: ${node.children?.map(x => x.serverName)}`)
    if (node.children){
        for (let i = 0; i < node.children.length; ++i){
            await recursiveNukeServers(ns, node.children[i]);
        }
    }
}

async function crackServer(ns: NS, server: string): Promise<void> {
    ns.print(`Cracking: ${server}`);
    if (hasSsh) await pFunc<void>(ns, 'brutessh', `'${server}'`);
    if (hasFtp) await pFunc<void>(ns, 'ftpcrack', `'${server}'`);
    if (hasSmtp) await pFunc<void>(ns, 'relaysmtp', `'${server}'`);
    if (hasHttp) await pFunc<void>(ns, 'httpworm', `'${server}'`);
    if (hasSql) await pFunc<void>(ns, 'sqlinject', `'${server}'`);
}
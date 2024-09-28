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

export async function main(ns: NS) {
    ns.tail();
    ns.disableLog('disableLog');
    ns.disableLog('exec');
    ns.disableLog('asleep');
    var hasSsh = await pFunc<boolean>(ns, 'fileExists', `'${settings.fileNames.BruteSSH}'`, `'home'`);
    var hasFtp = await pFunc<boolean>(ns, 'fileExists', `'${settings.fileNames.FTPCrack}'`, `'home'`);
    var hasSmtp = await pFunc<boolean>(ns, 'fileExists', `'${settings.fileNames.relaySMTP}'`, `'home'`);
    var hasHttp = await pFunc<boolean>(ns, 'fileExists', `'${settings.fileNames.HTTPWorm}'`, `'home'`);
    var hasSql = await pFunc<boolean>(ns, 'fileExists', `'${settings.fileNames.SQLInject}'`, `'home'`);
    var crackersCount = (+hasSsh) + (+hasFtp) + (+hasSmtp) + (+hasHttp) + (+hasSql);
    ns.print(`Crackers owned: ${crackersCount}`);
    
    var root = (await StorageUtils.GetObject(ns, StorageKeys.ServersTree)) as ServerTreeNode;
    serverDetails = (await StorageUtils.GetObject(ns, StorageKeys.ServerDetailsList)) as ServerDetails[];
    await recursiveNukeServers(ns, root);
}

async function recursiveNukeServers(ns: NS, node: ServerTreeNode): Promise<void> {
    let details = serverDetails.find(srv => srv.serverName === node.serverName);
    if (details!.hasAdminRights === false && node.serverName !== 'home') {
        await crackServer(ns, node.serverName);
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
    await pFunc<void>(ns, 'brutessh', `'${server}'`)
    await pFunc<void>(ns, 'ftpcrack', `'${server}'`);
    await pFunc<void>(ns, 'relaysmtp', `'${server}'`);
    await pFunc<void>(ns, 'httpworm', `'${server}'`);
    await pFunc<void>(ns, 'sqlinject', `'${server}'`);
    await pFunc<void>(ns, 'nuke', `'${server}'`);
}
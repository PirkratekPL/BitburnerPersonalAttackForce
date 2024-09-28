import { NS } from '../bitburner';
import { CONSTS } from '../consts';
import { StorageKeys } from '../db/storage-keys';
import { StorageUtils } from '../db/storage-utils';
import { ServerTreeNode } from './server-tree-node.model';

var thisNS: NS;
function getNS(){ return thisNS; }
var servers: string[];

export function main(ns: NS) {
    thisNS = ns;
    var root: ServerTreeNode = {
        serverName: 'home',
        path: 'home',
        children: null,
    };
    
    servers = ['home'];
    recurseCreateTree(root);
    StorageUtils.PutObject(ns, StorageKeys.ServersTree, root);
}

function recurseCreateTree(node: ServerTreeNode){
    let ns = getNS();
    var scan = ns.scan(node.serverName);
    node.children = [];
    scan.forEach(server => {
        if (servers.includes(server) === false) {
            node.children!.push({
                serverName: server,
                path: node.path + `;connect ${server}`,
                children: null,
            });
            servers.push(server);
        }
    });
    node.children.forEach(child => {
        recurseCreateTree(child);
    })
}

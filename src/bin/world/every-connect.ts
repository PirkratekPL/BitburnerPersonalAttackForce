import { NS } from '../bitburner';
import { StorageKeys } from '../db/storage-keys';
import { StorageUtils } from '../db/storage-utils';
import { inputIntoTerminal } from '../utils/input-into-terminal';
import { ServerTreeNode } from './server-tree-node.model';



var result: string;
export async function main(ns: NS) {
    result = '';
    var target = ns.args[0] as string;
    var root = await StorageUtils.GetObject(ns, StorageKeys.ServersTree) as ServerTreeNode;
    ns.print(`target: ${target}`);
    findServerPath(ns, root, target);
    if (result) {
        ns.tprintRaw(result);
    } else {
        ns.tprintRaw(`Failed to find server: ${target}`);
    }

    await ns.asleep(50);

    inputIntoTerminal(result);
}

function findServerPath(ns: NS, node: ServerTreeNode, target: string) {
    if (node.serverName == target) {
        result = node.path;
        return;
    }
    else if (node.children) {
        for (let i = 0; i < node.children.length; ++i) {
            ns.print(`At: ${node.serverName} child: ${node.children[i].serverName}`);
            findServerPath(ns, node.children[i], target);
        }
    }
}

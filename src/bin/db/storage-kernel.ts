import { NS } from '../bitburner';
import { CONSTS } from '../consts';
import { PortUtils } from '../ports/port-utils';
import { StorageCommand, StorageCommandEnum } from './storage-command.model';
import { StorageGetResponse } from './storage-get-response.model';

var storage: { [key: string]: any };
var thisNS: NS;
function getNS(): NS {
    if (thisNS) {
        return thisNS;
    }

    throw new Error('thisNS was null');
}

export async function main(ns: NS) {
    init(ns);
    await readWriteLoop();
}

function init(ns: NS) {
    thisNS = ns;
    storage = {};
    ns.clearPort(CONSTS.storageOutputPortNumber);
    ns.disableLog('asleep');
    ns.atExit(() => ns.closeTail());
    ns.tail();
}

async function readWriteLoop(): Promise<never> {
    var ns = getNS();
    var portHandle = ns.getPortHandle(CONSTS.storageInputPortNumber);

    while (true) {
        var contents = portHandle.read();
        if (contents != 'NULL PORT DATA') {
            await processCommand(contents as StorageCommand);
            await ns.asleep(30);
        }
        await ns.asleep(150);

        TryRemoveStuckResult();
    }
}

async function processCommand(command: StorageCommand): Promise<void> {
    if (!command.key) {
        throw new Error('Key was not defined or empty');
    }
    var ns = getNS();
    ns.print(command)

    switch (command.command) {
        case StorageCommandEnum.PUT:
            storagePutObject(command);
            break;

        case StorageCommandEnum.GET:
            await storageGetObject(command);
            break;

        case StorageCommandEnum.DEL:
            storageDeleteObject(command);
            break;

        default:
            throw new Error(`Unknown command: '${command.command}' used`)
    }
}

function storagePutObject(command: StorageCommand) {
    storage[command.key] = command.object;
}

async function storageGetObject(command: StorageCommand): Promise<void> {
    var ns = getNS();
    var object = storage[command.key] ?? null;
    var result = <StorageGetResponse>{
        callerId: command.callerId,
        key: command.key,
        result: object,
        timestamp: new Date(Date.now())};
    
    await PortUtils.ResilientTryWriteToPort(
        ns,
        CONSTS.storageOutputPortNumber,
        result);
}

function storageDeleteObject(command: StorageCommand) {
    storage[command.key] = null;
}
function TryRemoveStuckResult() {
    var ns = getNS();
    var handle = ns.getPortHandle(CONSTS.storageOutputPortNumber);
    var peek = handle.peek() as StorageGetResponse;
    if ((+Date.now() - +peek.timestamp) >= 30_000) {
        ns.print(`removing stuck message from queue for key:${peek.key} and callerId:${peek.callerId}`);
        handle.read();
    }
}


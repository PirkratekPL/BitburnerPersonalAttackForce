import { NS } from '../bitburner';
import { CONSTS } from '../consts';
import { PortUtils } from '../ports/port-utils';
import { StorageCommand, StorageCommandEnum } from './storage-command.model';
import { StorageGetResponse } from './storage-get-response.model';

export abstract class StorageUtils {
    public static async PutObject(ns: NS, key: string, value: any): Promise<void> {
        var success = PortUtils.ResilientTryWriteToPort(ns, CONSTS.storageInputPortNumber, <StorageCommand>{
            command: StorageCommandEnum.PUT,
            key: key,
            object: value,
        });

        if (!success) {
            throw new Error('Timeout while trying to save object to storage');
        }
    }

    public static async GetObject(ns: NS, key: string): Promise<any | null> {
        var success = await PortUtils.ResilientTryWriteToPort(ns, CONSTS.storageInputPortNumber, <StorageCommand>{
            command: StorageCommandEnum.GET,
            key: key,
            callerId: ns.pid.toString(),
        });

        await ns.asleep(50);

        if (success) {
            var handle = ns.getPortHandle(CONSTS.storageOutputPortNumber);
            var tries = 0;
            while (true) {
                var objectOnTop = handle.peek() as StorageGetResponse;
                if (objectOnTop.callerId === ns.pid.toString() && objectOnTop.key === key) {
                    return (handle.read() as StorageGetResponse).result;
                }
                tries++;
                if (tries >= 20) {
                    throw new Error(`Timeout occured when trying to get object from storage for key: ${key}`);
                }

                await ns.asleep(150);
            }
        }
    }
}
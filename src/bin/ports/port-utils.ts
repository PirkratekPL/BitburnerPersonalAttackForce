import { NS } from '../bitburner';

const settings = {
    maxTries: 20,
    asleepMiliseconds: 40,
};

export abstract class PortUtils {
    public static async ResilientTryWriteToPort(ns: NS, portNumber: number, object: any): Promise<boolean> {
        var handle = ns.getPortHandle(portNumber);
        var tries = 0;
        do {
            var success = handle.tryWrite(object);
            if (success) {
                return true;
            }

            tries++;
            if (tries < settings.maxTries) {
                await ns.asleep(40);
                continue;
            }

            return false;
        } while (true);
    }
}
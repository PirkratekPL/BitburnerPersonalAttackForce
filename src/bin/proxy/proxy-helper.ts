import { NS, ScriptArg } from '../bitburner';
import { CONSTS } from '../consts';
import { ProxyResult } from './proxy-result.model';

export async function pFunc<T>(ns: NS, func: string, ...args: ScriptArg[]): Promise<T> {
    var ownPID = ns.pid;
    var pid = ns.exec('/bin/proxy/proxy-script.js', 'home', { threads:1 }, func, ownPID, ...args);
    var handle = ns.getPortHandle(CONSTS.proxyScriptOutputPort);
    var tries = 0;
    await ns.asleep(5);
    do {
        var peek = handle.peek() as ProxyResult<T>;
        if (peek.callerPID === ownPID && peek.pid == pid) {
            return (handle.read() as ProxyResult<T>).result;
        }
        tries++;
    } while (tries < 20 && await ns.asleep(150));

    throw new Error("Proxy script failed");
}
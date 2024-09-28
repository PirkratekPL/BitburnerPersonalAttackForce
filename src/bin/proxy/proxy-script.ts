import { NS } from '../bitburner';
import { CONSTS } from '../consts';
import { PortUtils } from '../ports/port-utils';
import { mapOfRam } from './proxy-ram-cost.map';
import { ProxyResult } from './proxy-result.model';

export function main(ns: NS) {
    var args = ns.args;

    var func = args.shift() as string;
    ns.ramOverride(1.6 + mapOfRam[func]);
    
    var calledPID = args.shift();
    var argsString = args.join(', ');

    var toEval = `ns.${func}(${argsString})`;
    ns.print(`ToEval: ${toEval}`);
    var result = eval(toEval);
    ns.print(result);
    var success = PortUtils.ResilientTryWriteToPort(ns, CONSTS.proxyScriptOutputPort, <ProxyResult<unknown>>{
        callerPID: calledPID,
        pid: ns.pid,
        result: result,
    });
    if (!success) {
        throw Error(`Proxy failed to write response`);
    }
}
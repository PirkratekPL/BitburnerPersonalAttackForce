import { NS, ProcessInfo } from '../../bitburner';
import { StorageKeys } from '../../db/storage-keys';
import { StorageUtils } from '../../db/storage-utils';
import { pFunc } from '../../proxy/proxy-helper';

export interface ProcessesTabDataModel {
    serversWithProcesses: { [server: string]: ProcessDetails[] };
}

export interface ProcessDetails {
    runAtServer: string;
    fileName: string;
    args: string[];
    pid: number;
    threads: number;
    usedRam: number;
}

export async function getProcessesData(ns: NS): Promise<ProcessesTabDataModel> {
    var serversToCheck: string[] = await StorageUtils.GetObject(ns, StorageKeys.ServerList);
    var result: ProcessesTabDataModel = {serversWithProcesses: {}};

    for (let i = 0; i < serversToCheck.length; i++) {
        let processes: ProcessInfo[] = await pFunc<ProcessInfo[]>(ns, 'ps', `'${serversToCheck[i]}'`);
        let processesDetails: ProcessDetails[] = [];
        for (let j = 0; j < processes.length; j++) {
            if (processes[j].filename === 'bin/proxy/proxy-script.js')
                continue;
            processesDetails.push(<ProcessDetails>{
                runAtServer: serversToCheck[i],
                fileName: processes[j].filename,
                args: processes[j].args,
                pid: processes[j].pid,
                threads: processes[j].threads,
                usedRam: processes[j].threads * (await pFunc<number>(ns, 'getScriptRam', `'${processes[j].filename}'`, `'${serversToCheck[i]}'`)),
            });
        }

        if (processes.length > 0)
            result.serversWithProcesses[serversToCheck[i]] = processesDetails;
    }

    return result;
}
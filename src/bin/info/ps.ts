import { NS } from '../bitburner';

export function main(ns: NS) {
    var ps = ns.ps();
    var lp = 1;
    ps.forEach(process => {
        ns.tprintRaw(`${lp}: ${process.filename} -t ${process.threads} || PID:${process.pid} || RAM:${ns.formatRam(ns.getScriptRam(process.filename) * process.threads)} ||`);
        lp++;
    });
}

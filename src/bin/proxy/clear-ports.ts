import { NS } from '../bitburner';

export async function main(ns: NS) {
    for (let i = 1; i <= 100_000; i+=10_000) {
        ns.tprintRaw(`Clearing ports [${i} - ${i+10_000}]`);
        for (let j = i; j < i + 10_000; j++){
            let data = '';
            do {
                data = ns.readPort(j);
            } while (data !== 'NULL PORT DATA')
        }
        await ns.asleep(100);
    }
    ns.tprintRaw('Clearing ports done');
}
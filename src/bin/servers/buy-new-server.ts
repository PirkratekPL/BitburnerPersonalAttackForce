import { NS } from '../bitburner';

const promptChoices = {
    buyChoices: [
        { index: 1, choice: 2**3 },
        { index: 2, choice: 2**4 },
        { index: 3, choice: 2**5 },
        { index: 4, choice: 2**6 },
        { index: 5, choice: 2**7 },
        { index: 6, choice: 2**8 },
        { index: 7, choice: 2**9 },
        { index: 8, choice: 2**10 },
        { index: 9, choice: 2**11 },
        { index: 10, choice: 2**12 },
        { index: 11, choice: 2**13 },
        { index: 12, choice: 2**14 },
        { index: 13, choice: 2**15 },
        { index: 14, choice: 2**16 },
        { index: 15, choice: 2**17 },
        { index: 16, choice: 2**18 },
        { index: 17, choice: 2**19 },
        { index: 17, choice: 2**20 },
    ],
}

export async function main(ns: NS) {
    var firstChoice = await ns.prompt('Buy or Upgrade server:', { type: 'select', choices: ['Buy', 'Upgrade'] }) as string;
    if (!firstChoice) {
        return;
    }

    switch(firstChoice) {
        case 'Buy': 
            var buySelection = await ns.prompt('Select ram for purchase:', { type: 'select', choices: getBuyChoices(ns)}) as string;
            if (!buySelection) {
                return;
            }
            var ramValue = convertSelectionToRam(buySelection);
            if (ramValue) {
                var serversOwner = ns.getPurchasedServers().length;
                ns.purchaseServer(`myServer${serversOwner}`, ramValue);
                ns.tprintRaw(`Purchased server 'myServer${serversOwner}' with ${ns.formatRam(ramValue)} RAM`);
            }
            break;
        case 'Upgrade':
            var serverSelection = await ns.prompt('Select server:', { type: 'select', choices: getServerChoices(ns)}) as string;
            var selectedServerName = serverSelection.substring(0, serverSelection.indexOf(':'));
            var upgradeChoice = await ns.prompt('Select upgrade:', { type: 'select', choices: getUpgradeChoices(ns, selectedServerName) }) as string;
            var ramValue = convertSelectionToRam(upgradeChoice);
            var result = ns.upgradePurchasedServer(selectedServerName, ramValue);
            ns.tprintRaw(result ? `Upgraded server ${selectedServerName} to have ${ns.formatRam(ramValue)} ram` : `Failed to upgrade server ${selectedServerName}`);
            break;
    }
}

function getBuyChoices(ns: NS): string[] {
    return promptChoices.buyChoices.map(x => `${x.index}: ${ns.formatRam(x.choice)} : ${ns.formatNumber(ns.getPurchasedServerCost(x.choice))}`);
}

function getServerChoices(ns: NS): string[] {
    var servers = ns.getPurchasedServers();
    return servers.map(x => `${x}: ${ns.formatRam(ns.getServerMaxRam(x))}`);
}

function getUpgradeChoices(ns: NS, serverName: string): string[] {
    var ram = ns.getServerMaxRam(serverName);
    return promptChoices.buyChoices.filter(x => x.choice > ram).map(x => `${x.index}: ${ns.formatRam(x.choice)} => ${ns.formatNumber(ns.getPurchasedServerUpgradeCost(serverName, x.choice))}`);
}

function convertSelectionToRam(selection: string): number {
    var colonIndex = selection.indexOf(':');
    var choiceIndex = Number(selection.substring(0, colonIndex));
    return promptChoices.buyChoices.find(x => x.index == choiceIndex)!.choice;
}
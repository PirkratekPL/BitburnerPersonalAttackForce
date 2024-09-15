import { NS, ToastVariant } from '../bitburner';
import { BestGainPerDollarSpendUpgrade, UpgradeTypeEnum } from './best-gain-per-dollar-upgrade-choice.model';

const settings = {
    costThreshold: 0.5,
    maxNodes: 30,
    maxNodeLevel: 200,
    maxNodeRam: 64,
    maxNodeCores: 8,
}
var thisNS: NS;
function getNS(): NS {
    if (thisNS) {
        return thisNS;
    }

    throw new Error('thisNS was null');
}

export async function main(ns: NS) {
    init(ns);
    await upgradeLoop();
    ns.toast('AutoHacknet Completed', ToastVariant.SUCCESS, 5000);
}

function init(ns: NS) {
    thisNS = ns;
    ns.disableLog('disableLog');
    ns.disableLog('asleep');
}

async function upgradeLoop(): Promise<void> {
    var ns = getNS();
    while (true) {
        // decide what to buy
        var nodesCount = ns.hacknet.numNodes();
        var newNodeCost = ns.hacknet.getPurchaseNodeCost();
        var bestGainPerDollarSpendUpgrade = getGetBestGainPerDollarUpgrade();
        var moneyThresholdToSpend = ns.getPlayer().money * settings.costThreshold;

        // buy it
        if (nodesCount < settings.maxNodes) {
            if (newNodeCost < (bestGainPerDollarSpendUpgrade?.totalCost ?? Infinity)) {
                ns.hacknet.purchaseNode();
                ns.print(`Purchased new node`);
            }
        }
        if (!!bestGainPerDollarSpendUpgrade && bestGainPerDollarSpendUpgrade.totalCost < moneyThresholdToSpend) {
            switch (bestGainPerDollarSpendUpgrade.upgradeType) {
                case UpgradeTypeEnum.Level:
                    ns.print(`Purchased ${bestGainPerDollarSpendUpgrade.buyLevelsCount} levels on node #${bestGainPerDollarSpendUpgrade.onNode}`);
                    ns.hacknet.upgradeLevel(bestGainPerDollarSpendUpgrade.onNode, bestGainPerDollarSpendUpgrade.buyLevelsCount);
                    break;
                case UpgradeTypeEnum.Ram:
                    ns.print(`Purchased more RAM on node #${bestGainPerDollarSpendUpgrade.onNode}`);
                    ns.hacknet.upgradeRam(bestGainPerDollarSpendUpgrade.onNode);
                    break;
                case UpgradeTypeEnum.Cores:
                    ns.print(`Purchased Core level on node #${bestGainPerDollarSpendUpgrade.onNode}`);
                    ns.hacknet.upgradeCore(bestGainPerDollarSpendUpgrade.onNode);
                    break;
            }
        }

        // check exit conditions
        // max nodes and all maxed
        var shouldReturn = true;
        if (nodesCount < settings.maxNodes) {
            shouldReturn = false;
        } else {
            for (let i = ns.hacknet.numNodes() - 1; i >= 0; ++i) {
                var nodeStats = ns.hacknet.getNodeStats(i);
                if (!(nodeStats.cores >= settings.maxNodeCores
                    && nodeStats.level >= settings.maxNodeLevel
                    && nodeStats.ram >= settings.maxNodeRam)) {
                    shouldReturn = false;
                    break;
                }
            }
        }

        if (shouldReturn) {
            return;
        }

        await ns.asleep(5000);
    }
}

function getGetBestGainPerDollarUpgrade(): BestGainPerDollarSpendUpgrade | undefined {
    var ns = getNS();
    var nodesCount = ns.hacknet.numNodes();

    var result: BestGainPerDollarSpendUpgrade | undefined;
    for (let i = 0; i < nodesCount; ++i) {
        var nodeStats = ns.hacknet.getNodeStats(i);

        // check level upgrade
        if (nodeStats.level < settings.maxNodeLevel) {
            if (nodeStats.level % 10 !== 0) {
                var levelsToBuy = 10 - (nodeStats.level % 10);
                return {
                    onNode: i,
                    upgradeType: UpgradeTypeEnum.Level,
                    totalCost: ns.hacknet.getLevelUpgradeCost(i, levelsToBuy),
                    buyLevelsCount: levelsToBuy,
                };
            }

            var cost = ns.hacknet.getLevelUpgradeCost(i, 10);
            if (cost < (result?.totalCost ?? Infinity)) {
                result = {
                    onNode: i,
                    upgradeType: UpgradeTypeEnum.Level,
                    totalCost: cost,
                    buyLevelsCount: 10,
                };
            }
        }

        // check RAM upgrade
        if (nodeStats.ram < settings.maxNodeRam) {
            var cost = ns.hacknet.getRamUpgradeCost(i);
            if (cost < (result?.totalCost ?? Infinity)) {
                result = {
                    onNode: i,
                    upgradeType: UpgradeTypeEnum.Ram,
                    totalCost: cost,
                };
            }
        }

        // check core upgrade
        if (nodeStats.cores < settings.maxNodeCores) {
            var cost = ns.hacknet.getCoreUpgradeCost(i);
            if (cost < (result?.totalCost ?? Infinity)) {
                result = {
                    onNode: i,
                    upgradeType: UpgradeTypeEnum.Cores,
                    totalCost: cost,
                }
            }
        }
    }

    return result;
}
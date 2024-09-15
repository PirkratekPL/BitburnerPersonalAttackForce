export interface BestGainPerDollarSpendUpgrade {
    onNode: number;
    upgradeType: UpgradeTypeEnum,
    totalCost: number,
    buyLevelsCount?: number
}

export enum UpgradeTypeEnum {
    Level,
    Ram,
    Cores,
}
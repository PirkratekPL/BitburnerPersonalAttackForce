export enum StorageCommandEnum {
    PUT,
    GET,
    DEL,
}

export interface StorageCommand {
    command: StorageCommandEnum,
    callerId: string;
    key: string;
    object: any | null | undefined;
}
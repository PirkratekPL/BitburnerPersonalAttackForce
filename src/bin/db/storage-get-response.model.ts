export interface StorageGetResponse {
    callerId: string;
    key: string;
    result: any | null;
    timestamp: Date;
}
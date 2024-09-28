export interface ProxyResult<T> {
    callerPID: number;
    pid: number;
    result: T;
}
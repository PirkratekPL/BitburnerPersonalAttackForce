export interface ServerTreeNode {
    serverName: string;
    path: string;
    children: ServerTreeNode[] | null;
}
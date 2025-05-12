
export interface Turn {
    type: "move" | "pass";
    node: Node;
}

export interface Node {
    x: number;
    y: number;
}

export class GoBoard {
    /**
    * -1 - not a router
    *  0 - unclaimed router
    *  1 - black stone
    *  2 - white stone
    * state[x][y]
    */
    public state: number[][];
    public lastWhiteMove: Turn | null = null;
    public get size() : number {
        return this.state.length;
    }
    

    public constructor(state: number[][], lastWhiteMove: Turn) {
        this.state = state;
        this.lastWhiteMove = lastWhiteMove;
    }

    public copyState(state: number[][]) {

    }

    public getScore(): { black: number, white: number } {
        let black = 0;
        let white = 0;
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (this.state[x][y] === 1)
                    black++;
                else if (this.state[x][y] === 2) {
                    white++;
                }
            }
        }

        return { black: black, white: white };
    }

    public move(node: Node): GoBoard {
        if (this.isValidMove(node)) {
            
        }

        throw new Error(`Invalid move at x: ${node.x}, y: ${node.y}`);
    }

    public getValidMoves(): Node[] {
        return [];
    }

    public isValidMove(node: Node): boolean {
        var nodeState = this.state[node.x][node.y];
        if (nodeState === 2) {
            // TODO: check condition if node was just captured and would recapture -> false
            // TODO: check condition if node would make own network captured
            return true;
        }
        
        return false;
    }

    public getNodeAt(node: Node): number {
        if (node.x < 0 || node.y < 0) return -1;
        if (node.x >= this.size || node.y >= this.size) return -1;
        return this.state[node.x][node.y];
    }

    public getNeightbours(node: Node): { up: number, right: number, down: number, left: number } {
        return {
            up: this.getNodeAt({x: node.x, y: node.y + 1}),
            right: this.getNodeAt({x: node.x + 1, y: node.y}),
            down: this.getNodeAt({x: node.x, y: node.y - 1}),
            left: this.getNodeAt({x: node.x - 1, y: node.y}),
        };
    }
}
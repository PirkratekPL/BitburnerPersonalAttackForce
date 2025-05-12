import { GoOpponent, NS } from '../../bitburner';
import { Turn, Node, GoBoard } from './go-board';

const opponents: GoOpponent[] = ['Netburners', 'Slum Snakes', 'The Black Hand', 'Tetrads', 'Daedalus', 'Illuminati'];
export async function main(ns: NS){
    while (true) {
        ns.go.resetBoardState(opponents[Math.floor(Math.random() * 6)], 5);
        
        do {
            let moveChoice = getRandomMove(ns);
            if (moveChoice === null) {
                await ns.go.passTurn();
                break;
            }
            await ns.go.makeMove(moveChoice.x, moveChoice.y);
        } while (true);
    }
}

function getRandomMove(ns: NS): Node | null {
    let availabeMoves = getValidMoves(ns);
    availabeMoves = removeMovesInOwnTeritory(ns, availabeMoves);
    if (availabeMoves.length === 0) return null;
    var moveChoice = availabeMoves[Math.floor(Math.random() * availabeMoves.length)];
    return moveChoice;
}

function getBestMove(ns: NS): Turn | null {
    let availabeMoves = getValidMoves(ns);
    let max = Number.MIN_VALUE;
    let selectedMove: Turn | null = null;
    availabeMoves.forEach(move => {
        //let score = getScoreAfterMove(ns, move);
       // if (score > max) selectedMove = move;
    });

    return selectedMove;
}


function getValidMoves(ns: NS): Node[] {
    var moves = ns.go.analysis.getValidMoves();
    var coordinatedMoves: Node[] = [];
    for (let x = 0; x < moves.length; x++) {
        var column = moves[x];
        for (let y = 0; y < column.length; y++) {
            if(column[y]) coordinatedMoves.push({x: x, y: y});
        }
    }
    return coordinatedMoves;
}

function removeMovesInOwnTeritory(ns: NS, availabeMoves: Node[]): Node[] {
    const controlledNodes = ns.go.analysis.getControlledEmptyNodes();
    let ownControlled: Node[] = [];
    for (let x = 0; x < controlledNodes.length; x++) {
        let row = controlledNodes[x];
        for (let y = 0; y < row.length; y++) {
            if (row[y] === 'X')
                ownControlled.push({x: x, y: y});
        }
    }

    return availabeMoves.filter(move => ownControlled.findIndex(owned => owned.x === move.x && owned.y === move.y) < 0);
}

function printMoves(ns: NS, availabeMoves: Node[]) {
    availabeMoves.forEach(move => {
        ns.tprintRaw(`x: ${move.x}, y: ${move.y}`);
    });
}
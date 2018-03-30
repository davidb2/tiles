import { Move } from "../Move";
import { Location } from "../Location";
import { Solver } from "./Solver";
import { SinglePiece } from "../Pieces/SinglePiece";
import { LPiece } from "../Pieces/LPiece";
import { Orientation } from "../Orientation";


export class BFSSolver extends Solver {
  private location: Location;
  private grid: boolean[][];
  private queue: Move[];

  public reset(k: number): void {
    super.reset(k);
    this.resetGrid(k)
    this.queue = [new Move(new SinglePiece(), new Location(0, 0))];
  }

  private resetGrid(k: number) {
    this.grid = [];
    for (let r = 0; r < (1 << k); r++) {
      let row: boolean[] = [];
      for (let c = 0; c < (1 << k); c++) {
        row.push(false);
      }
      this.grid.push(row);
    }
  }

  public getNextMove(): Move {
    while (this.queue.length > 0) {
      const topMove: Move = this.queue[0];
      this.queue.shift();
      if (this.fits(topMove)) {
        for (let loc of topMove.piece.getRelativeIndices()) {
          this.grid[topMove.location.row + loc.row][topMove.location.col + loc.col] = true;

          this.queue.push(
            new Move(
              new LPiece(Orientation.Up),
              new Location(topMove.location.row + loc.row + 1, topMove.location.col + loc.col + 1)
            )
          );
          this.queue.push(
            new Move(
              new LPiece(Orientation.Down),
              new Location(topMove.location.row + loc.row - 1, topMove.location.col + loc.col - 1)
            )
          );
          this.queue.push(
            new Move(
              new LPiece(Orientation.Left),
              new Location(topMove.location.row + loc.row - 1, topMove.location.col + loc.col + 1)
            )
          );
          this.queue.push(
            new Move(
              new LPiece(Orientation.Right),
              new Location(topMove.location.row + loc.row + 1, topMove.location.col + loc.col - 1)
            )
          );
        }
        return topMove;
      }
    }
  }

  private fits(move: Move): boolean {
    console.log(move);
    const moveLocation: Location = move.location;
    for (let relativeIndex of move.piece.getRelativeIndices()) {
      const rowPlacement = moveLocation.row + relativeIndex.row;
      const colPlacement = moveLocation.col + relativeIndex.col;
      
      if (!((0 <= rowPlacement && rowPlacement < this.grid.length) &&
           (0 <= colPlacement && colPlacement < this.grid[0].length))) {
        return false;
      } else if (this.grid[rowPlacement][colPlacement]) {
        return false;
      }
    }
    return true;
  }

  constructor(k: number) {
    super(k);
    this.reset(k);
  }
}

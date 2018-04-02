import { Move } from "../Move";
import { Location } from "../Location";
import { Solver } from "./Solver";
import { SinglePiece } from "../Pieces/SinglePiece";
import { LPiece } from "../Pieces/LPiece";
import { Orientation } from "../Orientation";

export class SpiralSolver extends Solver {
  private moves: Iterator<Move>;

  public reset(k: number): void {
    super.reset(k);
    this.moves = this.getMoves(k);
  }

  public getNextMove(): Move {
    const move: Move = this.moves.next().value;
    console.log(move);
    return move;
  }
  
  private *getMoves(k: number): Iterator<Move> {
    if (k === 0) {
      yield new Move(new SinglePiece(), new Location(0, 0));
    } else if (k === 1) {
      yield new Move(new SinglePiece(), new Location(0, 0));
      yield new Move(new LPiece(Orientation.Up), new Location(1, 1));
    } else {
      const innerFrame: Iterator<Move> = this.getMoves(k - 1);
      while (true) {
        const nextMove: Move = innerFrame.next().value;
        console.log(nextMove);
        if (!nextMove) {
          break;
        }
        yield new Move(
          nextMove.piece,
          new Location(
            (1 << (k - 2)) + nextMove.location.row,
            (1 << (k - 2)) + nextMove.location.col
          )
        );
      }
      
      if (k === 2) {
        yield new Move(new LPiece(Orientation.Down), new Location(0, 0));
        yield new Move(new LPiece(Orientation.Left), new Location(0, 3));
        yield new Move(new LPiece(Orientation.Up), new Location(3, 3));
        yield new Move(new LPiece(Orientation.Right), new Location(3, 0));
      } else {
        // build outer frame
        for (let layer = (1 << (k - 2)) - 2; layer >= 0; layer -= 2) {
          // top
          for (let col = 0; col < (1 << (k - 2)); col++) {
            yield new Move(
              new LPiece(Orientation.Right),
              new Location(layer + 1, 3 * col)
            );
            yield new Move(
              new LPiece(Orientation.Left),
              new Location(layer, 3 * col + 2)
            );
          }

          // right
          for (let row = 0; row < (1 << (k - 2)); row++) {
            yield new Move(
              new LPiece(Orientation.Down),
              new Location(3 * row, (1 << k) - layer - 2)
            );
            yield new Move(
              new LPiece(Orientation.Up),
              new Location(3 * row + 2, (1 << k) - layer - 1)
            );
          }

          // bottom
          for (let col = 0; col < 1 << (k - 2); col++) {
            yield new Move(
              new LPiece(Orientation.Left),
              new Location((1 << k) - layer - 2, (1 << k) - 3 * col - 1)
            );
            yield new Move(
              new LPiece(Orientation.Right),
              new Location((1 << k) - layer - 1, (1 << k) - 3 * col - 3)
            );
          }

          // left
          for (let row = 0; row < (1 << (k - 2)); row++) {
            yield new Move(
              new LPiece(Orientation.Up),
              new Location((1 << k) - 3 * row - 1, layer + 1)
            );
            yield new Move(
              new LPiece(Orientation.Down),
              new Location((1 << k) - 3 * row - 3, layer)
            );
          }

        }
      }
    }
  }
}

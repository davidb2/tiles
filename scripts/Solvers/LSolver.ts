import { Move } from "../Move";
import { Location } from "../Location";
import { Solver } from "./Solver";
import { SinglePiece } from "../Pieces/SinglePiece";
import { LPiece } from "../Pieces/LPiece";
import { Orientation } from "../Orientation";

export class LSolver extends Solver {
  private moves: Iterator<Move>;

  public reset(k: number): void {
    super.reset(k);
    this.moves = this.getMoves(k);
  }

  public getNextMove(): Move {
    const move: Move = this.moves.next().value;
    return move;
  }

  /**
   * quadrants
   * 0 1
   * 3 2
   */
  private rotate(move: Move, quadrant: number, k: number): Move {
    let orientation: Orientation = move.piece.orientation;
    for (let i = 0; i < (quadrant % 4) && quadrant % 2 === 1; i++) {
      switch (+orientation) {
        case Orientation.Up:
          orientation = Orientation.Left;
          break;
        case Orientation.Right:
          orientation = Orientation.Up;
          break;
        case Orientation.Down:
          orientation = Orientation.Right;
          break;
        case Orientation.Left:
          orientation = Orientation.Down;
          break;
      }
    }
    const rotatedPiece: LPiece = new LPiece(orientation);

    let row = 0;
    let col = 0;
    switch (quadrant % 4) {
      case 0:
        break;
      case 1:
        col = (1 << (k - 1));
        break;
      case 2:
        row = (1 << (k - 1));
        col = (1 << (k - 1));
        break;
      case 3:
        row = (1 << (k - 1));
        break;
    }
    let rrow = move.location.row;
    let rcol = move.location.col;

    for (let i = 0; i < (quadrant % 4) && quadrant % 2 === 1; i++) {
      const oldRRow = rrow;
      rrow = (1 << (k - 1)) - rcol - 1;
      rcol = oldRRow;
    }
    const rotatedLocation: Location = new Location(
      row + rrow, 
      col + rcol 
    );
    const rotatedMove: Move = new Move(rotatedPiece, rotatedLocation);
    return rotatedMove;
  }

  private *getMoves(k: number): Iterator<Move> {
    if (k === 0) {
      yield new Move(new SinglePiece(), new Location(0, 0));
    } else {
      const topLeft: Iterator<Move> = this.getMoves(k - 1);
      let moves: Move[] = [];

      while (true) {
        const nextMove: Move = topLeft.next().value;
        if (!nextMove) {
          break;
        }
        moves.push(nextMove);
      }

      for (let move of moves) {
        if (move.piece instanceof SinglePiece) {
          yield move;
        } else if (move.piece instanceof LPiece) {
          yield this.rotate(move, 0, k);
        }
      }

      yield new Move(
        new LPiece(Orientation.Up), 
        new Location(1 << (k - 1), 1 << (k - 1))
      );

      for (let quadrant of [1, 2, 3]) {
        for (let move of moves) {
          if (move.piece instanceof LPiece) {
            yield this.rotate(move, quadrant, k);
          }
        }
      }
    }
  }
}



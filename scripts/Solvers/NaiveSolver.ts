import { Move } from "../Move";
import { Location } from "../Location";
import { Solver } from "./Solver";
import { SinglePiece } from "../Pieces/SinglePiece";


export class NaiveSolver extends Solver {
  private location: Location;

  public reset(k: number): void {
    this.location = new Location(-1, (1 << k) - 1);
    this.k = k;
  }

  public getNextMove(): Move {
    if (this.location.row == (1 << this.k) - 1 && this.location.col == (1 << this.k) - 1) {
      return undefined;
    }
    const location = new Location(
      this.location.row + (+(this.location.col == (1 << this.k) - 1)),
      (this.location.col + 1) % (1 << this.k)
    );
    const piece = new SinglePiece();
    this.location = location;
    return new Move(piece, location);
  }

  constructor(k: number) {
    super(k);
    this.reset(k);
  } 
}

import { Location } from "../Location";
import { Orientation } from "../Orientation";

export abstract class Piece {
  protected orientation: Orientation;
  public abstract getRelativeIndices(orientation?: Orientation): Location[];
  constructor(orientation?: Orientation) {
    this.orientation = orientation;
  }
}

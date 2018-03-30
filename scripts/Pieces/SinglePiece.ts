import { Piece } from "./Piece";
import { Location } from "../Location";
import { Orientation } from "../Orientation";

export class SinglePiece extends Piece {
  public getRelativeIndices(): Location[] {
    return [new Location(0, 0)];
  }

  constructor(orientation?: Orientation) {
    super(orientation);
  }
}

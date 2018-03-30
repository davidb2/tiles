import { Location } from "./Location";
import { Piece } from "./Pieces/Piece";

export class Move {
  public piece: Piece;
  public location: Location;

  constructor(piece: Piece, location: Location) {
    this.piece = piece;
    this.location = location;
  }
}

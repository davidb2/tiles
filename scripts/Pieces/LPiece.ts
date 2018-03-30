import { Piece } from "./Piece";
import { Location } from "../Location";
import { Orientation } from "../Orientation";

export class LPiece extends Piece {
  public getRelativeIndices(): Location[] {
    switch (+this.orientation) {
      /**
       *  #
       * ##
       */
      case Orientation.Up:
        return [
          new Location(0, 0),
          new Location(-1, 0),
          new Location(0, -1),
        ];
      /**
       * ##
       * #
       */
      case Orientation.Down:
        return [
          new Location(0, 0),
          new Location(+1, 0),
          new Location(0, +1),
        ];
      /**
       * ##
       *  #
       */
      case Orientation.Left:
        return [
          new Location(0, 0),
          new Location(0, -1),
          new Location(+1, 0),
        ];
      /**
       * #
       * ##
       */
      case Orientation.Right:
        return [
          new Location(0, 0),
          new Location(0, +1),
          new Location(-1, 0),
        ];
      default:
        console.error(`Orientation '${orientation}' not known.`);
        break;
    }
  }

  constructor(orientation?: Orientation) {
    super(orientation);
  }
}

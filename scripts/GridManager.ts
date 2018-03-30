import { Color } from "./Utils/Color";
import { Grid } from "./Grid";
import { Move } from "./Move";
import { Solver } from "./Solvers/Solver";
import { Q } from "./Exports";

export class GridManager {
  private readonly _canvasElement: HTMLCanvasElement;
  private readonly _context: CanvasRenderingContext2D;
  private readonly _grid: Grid;

  constructor(canvasElement: HTMLCanvasElement, k: number) {
    this._canvasElement = canvasElement;
    this._context = canvasElement.getContext('2d');
    this._grid = new Grid(k);
  }

  public async solve(solver: Solver) {
    let delay = (ms: number) => {
      return new Promise(r => setTimeout(r, ms));
    } 
    this.draw();
    return Q().then( async () => {
      const solved: Iterator<Move> = this.grid.solve(solver);
      const cycle: Iterator<Color> = Color.cycle(this.grid.k);
      while (true) {
        try {
          const move: Move = solved.next().value;
          for (let coord of move.piece.getRelativeIndices()) {
            this.grid.grid[move.location.row + coord.row][move.location.col + coord.col] = cycle.next().value;
          }
          this.draw();
          await delay(1);
        } catch (e) {
          console.log('exited loop', e);
          break;
        }
      }
      return Q();
    });
  }

  private draw() {
    let width: number = this.canvasElement.width / (1 << this.grid.k);
    let height: number = this.canvasElement.height / (1 << this.grid.k);
    for (let row: number = 0; row < (1 << this.grid.k); row++) {
      for (let col: number = 0; col < (1 << this.grid.k); col++) {
        let x: number = col * width;
        let y: number = row * height;
        let color: Color = this.grid.grid[row][col]; 
        this.context.beginPath();
        this.context.rect(x, y, width, height);
        this.context.fillStyle = color.hexString;
        this.context.fill();
      }
    }
  }

  get canvasElement(): HTMLCanvasElement { return this._canvasElement; }
  get context(): CanvasRenderingContext2D { return this._context; }
  get grid(): Grid { return this._grid; }
}

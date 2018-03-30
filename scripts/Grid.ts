import { Solver } from "./Solvers/Solver";
import { Move } from "./Move";
import { Color } from "./Utils/Color";

export class Grid {
  public grid: Color[][];
  public k: number;
  public solved: boolean;

  constructor(k: number) {
    this.constructGrid(k);  
    this.solved = false;
    this.k = k;
  }

  public *solve(solver: Solver) {
    let move: Move = undefined;
    do {
      move = solver.getNextMove();
      yield move;
    } while (move);
  } 
   
  private constructGrid(k: number) {
    this.grid = [];
    for (let r = 0; r < (1 << k); r++) {
      let row = [];
      for (let c = 0; c < (1 << k); c++) {
        row.push(Color.White);
      }
      this.grid.push(row);
    }
  }
}

import { GridManager } from "./GridManager";
import { NaiveSolver } from "./Solvers/NaiveSolver";
import { BFSSolver } from "./Solvers/BFSSolver";
import { LSolver } from "./Solvers/LSolver";
import { SpiralSolver } from "./Solvers/SpiralSolver";
import * as Pro from "../third_party/q.js";
import * as Ex from "./Exports";

// make Q() global
Ex.setQ(Pro);

const K = 8;
const bfsSolver = new BFSSolver(K);
const spiralSolver = new SpiralSolver(K);
const lSolver = new LSolver(K);
let idx = 0;
for (let solver of [bfsSolver, spiralSolver, lSolver]) {
  const c: HTMLCanvasElement = <HTMLCanvasElement> window.document.getElementById(`canvas-${idx++}`);
  const gridManager = new GridManager(c, K);
  gridManager.solve(solver).then(() => { console.log('done!'); });
}

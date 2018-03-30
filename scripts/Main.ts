import { GridManager } from "./GridManager";
import { NaiveSolver } from "./Solvers/NaiveSolver";
import { BFSSolver } from "./Solvers/BFSSolver";
import * as Pro from "../third_party/q.js";
import * as Ex from "./Exports";

// make Q() global
Ex.setQ(Pro);

const K = 10;
const c: HTMLCanvasElement = <HTMLCanvasElement> window.document.getElementById('mainCanvas');
const gridManager = new GridManager(c, K);
const solver = new BFSSolver(K);
gridManager.solve(solver).then(() => { console.log('done!'); });

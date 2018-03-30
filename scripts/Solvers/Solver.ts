import { Move } from "../Move";

export abstract class Solver {
  protected k: number;

  public reset(k: number): void {
    this.k = k;
  }
  
  public abstract getNextMove(): Move;

  constructor(k: number) {
    this.reset(k);
  } 
}

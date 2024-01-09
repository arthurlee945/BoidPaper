import { BaseBoidPaper } from "./extends/BaseBoidPaper";

export class BoidPaper extends BaseBoidPaper {
  protected renderBoidMaterial(_delta: number, _cp: number): void {
    throw new Error("Method not implemented.");
  }
}

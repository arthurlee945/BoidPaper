import { BaseBoidPaper } from "./extends/BaseBoidPaper";
import { type BaseBoidPaperOpts } from "./extends/baseBoidPaperOpts";

export class BoidPaper extends BaseBoidPaper {
  constructor(opts: BaseBoidPaperOpts) {
    super(opts);
  }
  protected renderBoidMaterial(_delta: number, _cp: number): void {
    throw new Error("Method not implemented.");
  }
}

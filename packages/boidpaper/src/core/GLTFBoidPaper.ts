import { BaseBoidPaper } from "./extends/BaseBoidPaper";

export class GLTFBoidPaper extends BaseBoidPaper {
  protected renderBoidMaterial(_delta: number, _cp: number): void {
    throw new Error("Method not implemented.");
  }
}

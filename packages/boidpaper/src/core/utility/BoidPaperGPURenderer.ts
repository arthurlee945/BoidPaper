import { HalfFloatType, RepeatWrapping, type DataTexture, type WebGLRenderer } from "three";
import { GPUComputationRenderer, type Variable } from "three/addons/misc/GPUComputationRenderer.js";

import { positionFragmentShader } from "../../geometry/shaders/behavior/positionFragmentShader";
import { velocityFragmentShader } from "../../geometry/shaders/behavior/velocityFragmentShader";
import { BoidPaperError } from "../../util/errors/BoidPaperError";

export class BoidPaperGPURenderer extends GPUComputationRenderer {
  private resRange: number;

  positionVar: Variable;
  velocityVar: Variable;
  constructor(opts: { sizeX: number; sizeY: number; renderer: WebGLRenderer; resRange: number }) {
    super(opts.sizeX, opts.sizeY, opts.renderer);
    this.resRange = opts.resRange;
    if (!opts.renderer.capabilities.isWebGL2) this.setDataType(HalfFloatType);

    this.positionVar = this.addVariable("texturePosition", positionFragmentShader.shader, this.fillPositionTexture(this.createTexture()));
    this.velocityVar = this.addVariable("textureVelocity", positionFragmentShader.shader, this.fillVelocityTexture(this.createTexture()));

    this.setVariableDependencies(this.positionVar, [this.positionVar, this.velocityVar]);
    this.setVariableDependencies(this.velocityVar, [this.positionVar, this.velocityVar]);

    Object.assign(this.positionVar.material.uniforms, positionFragmentShader.getUniform());
    Object.assign(this.velocityVar.material.uniforms, velocityFragmentShader.getUniform());

    this.positionVar.wrapS = this.positionVar.wrapT = RepeatWrapping;
    this.velocityVar.wrapS = this.velocityVar.wrapT = RepeatWrapping;

    //-----Bind Method
    this.fillVelocityTexture = this.fillVelocityTexture.bind(this);
    this.fillPositionTexture = this.fillPositionTexture.bind(this);
  }

  initialize() {
    const error = this.init();

    if (error) throw new BoidPaperError({ code: "INTERNAL_SERVER_ERROR", message: error });
  }

  private fillPositionTexture(texture: DataTexture) {
    const texArr = texture.image.data;

    for (let k = 0, kl = texArr.length; k < kl; k += 4) {
      texArr[k] = Math.random() * this.resRange - this.resRange / 2;
      texArr[k + 1] = Math.random() * this.resRange - this.resRange / 2;
      texArr[k + 2] = Math.random() * this.resRange - this.resRange / 2;
      texArr[k + 3] = 1;
    }
    return texture;
  }

  private fillVelocityTexture(texture: DataTexture) {
    const texArr = texture.image.data;

    for (let k = 0, kl = texArr.length; k < kl; k += 4) {
      texArr[k] = (Math.random() - 0.5) * 10;
      texArr[k + 1] = (Math.random() - 0.5) * 10;
      texArr[k + 2] = (Math.random() - 0.5) * 10;
      texArr[k + 3] = 1;
    }
    return texture;
  }
}

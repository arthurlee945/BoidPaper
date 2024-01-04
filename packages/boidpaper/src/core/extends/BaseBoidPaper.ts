import { Fog, PerspectiveCamera, Scene } from "three";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer.js";

import { floorSqrtRoot } from "../../util/funcs/geometry/floorSqrtRoot";
import { type BaseBoidInitializer, type BaseBoidPaperOpts } from "./baseBoidPaperOpts";

const baseBPOpts = {
  boid: {
    count: 1024,
  },
  pointer: {
    active: true,
    range: 800,
  },
  rendererOpts: {
    alpha: true,
  },
  cameraOpts: [75, undefined, 1, 3000],
  sceneOpts: {
    fog: true,
    fogOpts: [0xffffff, 100, 1000],
  },
} as const satisfies BaseBoidPaperOpts;

export abstract class BaseBoidPaper {
  //-------- Three
  protected readonly renderer: WebGLRenderer;
  protected readonly scene: Scene;
  protected readonly camera: PerspectiveCamera;
  //-------- Internal
  protected readonly sqrtBoids: number;

  protected cntX?: number;
  protected cntY?: number;

  constructor({
    boid = baseBPOpts.boid,
    pointer = baseBPOpts.pointer,
    rendererOpts = baseBPOpts.rendererOpts,
    cameraOpts = baseBPOpts.cameraOpts,
    sceneOpts = baseBPOpts.sceneOpts,
  }: BaseBoidPaperOpts) {
    //-------- Opt Variables
    this.sqrtBoids = floorSqrtRoot(boid.count);
    //-------- Renderer
    this.renderer = new WebGLRenderer(rendererOpts);

    //-------- Scene
    this.scene = new Scene();
    if (sceneOpts.fog) this.scene.fog = new Fog(...sceneOpts.fogOpts);

    //-------- Camera
    this.camera = new PerspectiveCamera(...cameraOpts);

    //-------- Method Binds
    this.initialize = this.initialize.bind(this);
  }

  protected initialize({ rendererOpts }: BaseBoidInitializer) {
    //---------- Initialize Renderer
    this.cntX = rendererOpts.cntX;
    this.cntY = rendererOpts.cntY;
    this.renderer.setSize(this.cntX, this.cntY);
  }
}

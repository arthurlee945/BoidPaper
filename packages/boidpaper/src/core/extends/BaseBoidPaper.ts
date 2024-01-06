import { Fog, HalfFloatType, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";

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
  gui: false,
  stats: false,
} as const satisfies BaseBoidPaperOpts;

export abstract class BaseBoidPaper {
  //-------- Three
  protected readonly renderer: WebGLRenderer;
  protected readonly scene: Scene;
  protected readonly camera: PerspectiveCamera;
  protected readonly gpuCompute: GPUComputationRenderer;
  protected readonly gui?: GUI;
  protected readonly stats?: Stats;
  //-------- Internal
  protected readonly boid: {
    sqrt: number;
    color?: BaseBoidPaperOpts["boid"]["color"];
  };

  //-------- Variables
  protected pointer: NonNullable<BaseBoidPaperOpts["pointer"]>;
  protected cntX?: number;
  protected cntY?: number;
  // protected positionVar: Variable;
  // protected velocityVar: Variable;

  /**
   * To get list of default uniforms and attributes passed by WebGL
   * {@link https://threejs.org/docs/index.html#api/en/renderers/webgl/WebGLProgram}
   */
  constructor({
    boid = baseBPOpts.boid,
    pointer = baseBPOpts.pointer,
    rendererOpts = baseBPOpts.rendererOpts,
    cameraOpts = baseBPOpts.cameraOpts,
    sceneOpts = baseBPOpts.sceneOpts,
    gui = baseBPOpts.gui,
    stats = baseBPOpts.stats,
  }: BaseBoidPaperOpts) {
    //-------- Opt Variables
    this.boid = { sqrt: floorSqrtRoot(boid.count), color: boid.color };
    this.pointer = pointer;

    //-------- Renderer
    this.renderer = new WebGLRenderer(rendererOpts);

    //-------- Scene
    this.scene = new Scene();
    if (sceneOpts.fog) this.scene.fog = new Fog(...sceneOpts.fogOpts);

    //-------- Camera
    this.camera = new PerspectiveCamera(...cameraOpts);

    //-------- GPUComputationRenderer + Apply behavior shader
    this.gpuCompute = new GPUComputationRenderer(this.boid.sqrt, this.boid.sqrt, this.renderer);
    if (!this.renderer.capabilities.isWebGL2) this.gpuCompute.setDataType(HalfFloatType);

    //-------- Gui
    if (gui) {
      this.gui = new GUI();
    }

    //-------- Stats
    if (stats) {
      this.stats = new Stats();
    }

    //-------- Method Binds
    this.initializeRenderer = this.initializeRenderer.bind(this);
    this.initialize = this.initialize.bind(this);
  }

  private initializeRenderer({ rendererOpts }: BaseBoidInitializer["renderer"]) {
    this.cntX = rendererOpts.cntX;
    this.cntY = rendererOpts.cntY;
    this.renderer.setSize(this.cntX, this.cntY);
  }
  protected initialize({ renderer }: BaseBoidInitializer) {
    this.initializeRenderer(renderer);
  }
}

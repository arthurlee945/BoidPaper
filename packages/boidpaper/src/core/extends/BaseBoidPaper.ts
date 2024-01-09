import { Fog, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";

import { floorSqrtRoot } from "../../util/funcs/geometry/floorSqrtRoot";
import { throttle } from "../../util/funcs/global/throttle";
import { BoidPaperGPURenderer } from "../utility/BoidPaperGPURenderer";
import { type BaseBoidPaperOpts } from "./baseBoidPaperOpts";

export const baseBPOpts = {
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
  private lastCP = performance.now();
  private container: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private animationId: number | null = null;

  //-------- Three
  protected readonly renderer: WebGLRenderer;
  protected readonly scene: Scene;
  protected readonly camera: PerspectiveCamera;
  protected readonly gpuCompute: BoidPaperGPURenderer;
  protected readonly gui?: GUI;
  protected readonly stats?: Stats;

  //-------- Internal
  protected readonly boid: {
    sqrt: number;
    color?: BaseBoidPaperOpts["boid"]["color"];
  };
  protected readonly pointer: NonNullable<BaseBoidPaperOpts["pointer"]>;
  protected readonly guiControl?: NonNullable<BaseBoidPaperOpts["gui"]>;
  protected readonly guiEffectControl?: Record<string, number>;

  //-------- Variables
  protected cntX = 800;
  protected cntY = 800;
  protected pointerX = 0;
  protected pointerY = 0;

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
    gui,
    stats,
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
    this.gpuCompute = new BoidPaperGPURenderer({
      sizeX: this.boid.sqrt,
      sizeY: this.boid.sqrt,
      resRange: this.pointer.range ?? 800,
      renderer: this.renderer,
    });

    //-------- Gui
    if (gui) {
      this.gui = new GUI();
      this.guiControl = gui;
      this.guiEffectControl = Object.entries(gui).reduce(
        (set, [k, v]) => {
          set[k] = v.value;
          return set;
        },
        {} as Record<string, number>
      );
    }

    //-------- Stats
    if (stats) {
      this.stats = new Stats();
    }

    //-------- Method Binds
    this.initialize = this.initialize.bind(this);
    this.pointerEvent = this.pointerEvent.bind(this);
    this.pointerCB = this.pointerCB.bind(this);
    this.resizeEvent = this.resizeEvent.bind(this);
    this.updateBehaviorValues = this.updateBehaviorValues.bind(this);
    this.render = this.render.bind(this);
    this.animate = this.animate.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  protected initialize(container: HTMLElement) {
    this.container = container;
    this.container.innerHTML = "";

    //-------- Initilize Renderer
    this.cntX = container.clientWidth;
    this.cntY = container.clientWidth;
    this.renderer.setSize(this.cntX, this.cntY);
    this.container.appendChild(this.renderer.domElement);

    //-------- Initilize Stats
    if (this.stats) {
      this.stats.dom.style.position = "absolute";
      this.container.appendChild(this.stats.dom);
    }

    if (this.gui && this.guiControl && this.guiEffectControl) {
      this.updateBehaviorValues();
      for (const effectName of Object.keys(this.guiEffectControl)) {
        this.gui.add(this.guiEffectControl, effectName as never, ...this.guiControl[effectName]!.opts).onChange(this.updateBehaviorValues);
      }
      this.gui.close();
      this.gui.domElement.style.position = "absolute";
      this.gui.domElement.style.right = "0";
      this.container.appendChild(this.gui.domElement);
    }

    this.gpuCompute.initialize();
  }

  //--------- GUI Listener
  protected additionalBehaviorValues?(): void;
  private updateBehaviorValues = () => {
    if (!this.guiEffectControl) return;
    for (const effectName of Object.keys(this.guiEffectControl)) {
      const currentUniform = this.gpuCompute.velocityVar.material.uniforms[effectName];
      if (currentUniform) currentUniform.value = this.guiEffectControl[effectName];
    }
    if (this.additionalBehaviorValues) this.additionalBehaviorValues();
  };

  //------ Pointer Event
  pointerEvent(action: "add" | "remove") {
    if (!this.container) return;
    if (action === "add") {
      this.container.removeEventListener("pointermove", this.pointerCB);
      this.container.addEventListener("pointermove", this.pointerCB);
    } else this.container.removeEventListener("pointermove", this.pointerCB);
  }
  private pointerCB = (e: PointerEvent) => {
    if (!this.container || !this.cntX || !this.cntY) return;
    const { left, right, top, bottom } = this.container.getBoundingClientRect();
    const [posX, posY] = [e.clientX, e.clientY];
    if (posX < left || posX > right || posY > bottom || posY < top) return;
    this.pointerX = posX - left - this.cntX / 2;
    this.pointerY = posY - top - this.cntY / 2;
  };

  //------ Resize Event
  resizeEvent(action: "add" | "remove") {
    if (!this.container || typeof ResizeObserver === "undefined") return;
    //might need NPM package resize-observer
    if (action === "add") {
      if (!this.resizeObserver) {
        this.resizeObserver = new ResizeObserver(
          throttle((entries) => {
            //should only observe canvas container
            const observedCnt = entries[0];
            if (!observedCnt) return;
            const { width, height } = observedCnt.contentRect;
            this.cntX = width;
            this.cntY = height;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(width, height);
          }, 75)
        );
      }
      this.resizeObserver.observe(this.container);
    } else if (this.resizeObserver) this.resizeObserver.unobserve(this.container);
  }

  //------ MAIN RENDER FUNC
  protected abstract renderBoidMaterial(_delta: number, _cp: number): void;
  private render() {
    const currentCP = performance.now();
    let delta = (currentCP - this.lastCP) / 1000;

    if (delta > 1) delta = 1;

    if (this.gpuCompute.positionVar.material.uniforms.time) this.gpuCompute.positionVar.material.uniforms.time.value = currentCP;
    if (this.gpuCompute.positionVar.material.uniforms.delta) this.gpuCompute.positionVar.material.uniforms.delta.value = delta;
    if (this.gpuCompute.velocityVar.material.uniforms.time) this.gpuCompute.velocityVar.material.uniforms.time.value = currentCP;
    if (this.gpuCompute.velocityVar.material.uniforms.delta) this.gpuCompute.velocityVar.material.uniforms.delta.value = delta;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.gpuCompute.velocityVar.material.uniforms.predator?.value.set(this.pointerX / this.cntX, -this.pointerY / this.cntY, 0);
    this.pointerX = 9999;
    this.pointerY = 9999;

    this.renderBoidMaterial(delta, currentCP);

    this.lastCP = currentCP;

    this.renderer.render(this.scene, this.camera);
  }

  //------ Main Start Animation Func
  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.render();
    if (this.stats) this.stats.update();
  };
  start = () => this.animate();
  stop = () => this.animationId && cancelAnimationFrame(this.animationId);

  protected dispose() {
    this.pointerEvent("remove");
    this.resizeEvent("remove");

    this.gui?.destroy();
    this.renderer.dispose();
    this.gpuCompute.dispose();
    if (this.container) this.container.innerHTML = "";
  }
}

import { type Fog, type PerspectiveCamera, type WebGLRendererParameters } from "three";
import { type Variable } from "three/addons/misc/GPUComputationRenderer.js";

import { type NumericRange } from "../../util/types/NumericRange";

export type BaseBoidPaperOpts = {
  boid: {
    count: number;
    color?: [NumericRange<256>, NumericRange<256>, NumericRange<256>];
  };
  pointer?: {
    active: boolean;
    range?: number;
  };
  rendererOpts?: WebGLRendererParameters;
  cameraOpts?: ConstructorParameters<typeof PerspectiveCamera>;
  sceneOpts?: { fog: true; fogOpts: ConstructorParameters<typeof Fog> } | { fog?: false };
  gui?: boolean;
  stats?: boolean;
};

export type BaseBoidInitializeRenderer = {
  container: HTMLElement;
  rendererOpts: {
    cntX: number;
    cntY: number;
  };
};

export type BaseBoidInitializeGPURenderer = {
  velocityVar: Variable;
  positionVar: Variable;
};

export type BaseBoidInitializer = { renderer: BaseBoidInitializeRenderer; gpuRenderer: BaseBoidInitializeGPURenderer };

import { type Fog, type PerspectiveCamera, type WebGLRendererParameters } from "three";

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
  gui?: Record<string, { value: number; opts: [number, number, number] }>;
  stats?: boolean;
};

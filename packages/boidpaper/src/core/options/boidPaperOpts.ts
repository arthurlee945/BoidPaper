import { type NumericRange } from "../../util/types/NumericRange";

export type BoidPaperOpts = {
  boid: {
    count: number;
    color?: [NumericRange<256>, NumericRange<256>, NumericRange<256>];
  };
  pointer?: {
    active?: boolean;
    range?: number;
  };
};

export const bpDefault = {
  boid: {
    count: 1024,
  },
  pointer: {
    active: true,
    range: 800,
  },
} satisfies BoidPaperOpts;

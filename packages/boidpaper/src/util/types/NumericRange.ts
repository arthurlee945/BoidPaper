export type NumericRange<
  END extends number,
  START extends number = 0,
  ARR extends unknown[] = [],
  ACC extends number = never,
> = ARR["length"] extends END
  ? ACC | START | END
  : NumericRange<END, START, [...ARR, 1], ARR[START] extends undefined ? ACC : ACC | ARR["length"]>;

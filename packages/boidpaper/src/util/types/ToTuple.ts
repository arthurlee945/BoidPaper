type UnionToParam<U> = U extends unknown ? (_k: U) => void : never;
type UnionToSect<U> = UnionToParam<U> extends (_k: infer I) => void ? I : never;
type ExtractParam<F> = F extends (_a: infer A) => void ? A : never;

type ExtractOne<Union> = ExtractParam<UnionToSect<UnionToParam<Union>>>;
type SpliceOne<Union> = Exclude<Union, ExtractOne<Union>>;

type ToTupleRecursion<Union, Rslt extends unknown[]> = SpliceOne<Union> extends never
  ? [ExtractOne<Union>, ...Rslt]
  : ToTupleRecursion<SpliceOne<Union>, [ExtractOne<Union>, ...Rslt]>;

export type ToTuple<Union> = ToTupleRecursion<Union, []>;

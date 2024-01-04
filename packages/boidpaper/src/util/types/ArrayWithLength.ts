export type ArrayWithLength<Len extends number, T, Occ extends T[] = []> = Occ["length"] extends Len
  ? Occ
  : ArrayWithLength<Len, T, [T, ...Occ]>;

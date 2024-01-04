export function lerp(v1: number, v2: number, amount: number) {
  amount = Math.max(Math.min(amount, 1), 0);
  return v1 + (v2 - v1) * amount;
}

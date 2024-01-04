import { type NumericRange } from "../../types/NumericRange";

export const rgbToHex = (rgb: [NumericRange<256>, NumericRange<256>, NumericRange<256>]) => {
  const hex = parseInt("0x" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1));
  return !isNaN(hex) ? hex : 0x666666;
};

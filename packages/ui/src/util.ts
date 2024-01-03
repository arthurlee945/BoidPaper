import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export function randomId(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

export type classNameVariant = string | (string | false | undefined)[];

export type InputClassNameOptions = {
  container?: string;
  input?: string;
  label?: string;
  header?: string;
  error?: string;
};
export type Prettify<T> = {
  [K in keyof T]: T[K];
};

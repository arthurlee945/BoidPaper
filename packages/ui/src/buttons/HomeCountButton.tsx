import { type ComponentProps } from "react";

import { cn } from "../util";

export type HomeCountButtonProps = {
  text?: string;
  className?: string;
} & ComponentProps<"button">;

export const HomeCountButton = ({ text = "Placeholder text", className, ...rest }: HomeCountButtonProps) => {
  return (
    <button
      className={cn(
        "border border-neutral-950 px-4 py-2 text-lg font-semibold transition-[letter-spacing] hover:tracking-wider dark:border-neutral-100",
        className
      )}
      {...rest}
    >
      {text}
    </button>
  );
};

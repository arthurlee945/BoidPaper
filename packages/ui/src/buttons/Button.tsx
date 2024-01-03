import Link from "next/link";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

import { cn } from "../util";

type BaseButtonProps = {
  children: ReactNode;
  className?: string;
};

export type ButtonProps = BaseButtonProps &
  (
    | ({ href: string } & Omit<ComponentPropsWithoutRef<"a">, keyof BaseButtonProps | "href">)
    | ({ href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, keyof BaseButtonProps | "href">)
  );

export const Button = ({ className, children, ...props }: ButtonProps) => {
  const defaultStyle =
    "w-full font-medium rounded-[0.25rem] bg-accent-300 px-2 py-1 text-center text-black transition-[background-color] sm:max-w-[75%] lg:max-w-[66%] lg:min-w-[300px] lg:hover:bg-accent-200";
  if (typeof props.href === "string") {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={cn(defaultStyle, className)} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cn(defaultStyle, className)} {...props}>
      {children}
    </button>
  );
};

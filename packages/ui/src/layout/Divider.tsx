import { cn } from "../util";

export type DividerProps = {
  className?: string;
} & (
  | {
      line: true;
      lineXLength?: number;
      lineYLength?: number;
      bgColor?: string;
    }
  | { line?: false }
);

export const Divider = ({ className, ...props }: DividerProps) => {
  return (
    <div className={cn("w-full py-4 ", className)} aria-label="layout divider between elements">
      {props.line && (
        <hr
          style={{ width: props.lineXLength, height: props.lineYLength, backgroundColor: props.bgColor }}
          className="border-none bg-black bg-inherit dark:bg-white"
        />
      )}
    </div>
  );
};

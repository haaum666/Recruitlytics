import * as React from "react"
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-gray-300 bg-gray-200 text-gray-800 shadow-sm",
        secondary:
          "border-transparent bg-gray-800 text-white shadow-sm",
        destructive:
          "border-transparent bg-red-500 text-white shadow-sm",
        outline: "text-gray-800 border-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }

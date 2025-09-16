import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "../../utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-800 border border-gray-300 shadow-sm hover:bg-gray-100",
        destructive:
          "bg-red-500 text-white border border-gray-300 shadow-sm hover:bg-red-600",
        outline:
          "border border-gray-300 bg-white shadow-sm hover:bg-gray-100",
        secondary:
          "bg-gray-200 text-gray-800 border border-gray-300 shadow-sm hover:bg-gray-300",
        ghost: "border border-gray-300 bg-white shadow-sm hover:bg-gray-100",
        link: "text-gray-800 hover:text-gray-900",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }

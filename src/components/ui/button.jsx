import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn" // Убедитесь, что ваш путь к cn правильный

const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-800 border border-gray-300 shadow-sm hover:bg-gray-100 dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-700",
        destructive: "bg-red-500 text-white border border-gray-300 shadow-sm hover:bg-red-600 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-800",
        outline: "border border-gray-300 bg-white shadow-sm hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800",
        secondary: "bg-gray-200 text-gray-800 border border-gray-300 shadow-sm hover:bg-gray-300 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600",
        ghost: "border border-gray-300 bg-white shadow-sm hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
        link: "text-gray-800 hover:text-gray-900 dark:text-zinc-50 dark:hover:text-zinc-300",
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

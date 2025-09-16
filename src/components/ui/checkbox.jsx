import * as React from "react";
import { cn } from "../../utils/cn";

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    ref={ref}
    onClick={() => onCheckedChange && onCheckedChange(!checked)}
    className={cn(
      "peer h-4 w-4 shrink-0 border-2 border-gray-300 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-300 data-[state=checked]:text-gray-800",
      className,
      checked ? "bg-gray-300 text-gray-800" : "bg-white"
    )}
    data-state={checked ? "checked" : "unchecked"}
    {...props}
  >
    {checked && (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )}
  </button>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };

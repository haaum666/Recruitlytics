import * as React from "react";
import { cn } from "../../utils/cn";

const Checkbox = React.forwardRef(({ className, checked, ...props }, ref) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className,
      checked ? "bg-primary text-primary-foreground" : "bg-white"
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

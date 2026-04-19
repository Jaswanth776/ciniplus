import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled,
  type = "button",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cinema-bg focus:ring-cinema-primary disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cinema-primary text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/30",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700",
    outline: "border-2 border-cinema-primary text-cinema-primary hover:bg-cinema-primary/10",
    ghost: "text-slate-300 hover:text-white hover:bg-slate-800",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg font-semibold",
    icon: "p-2"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

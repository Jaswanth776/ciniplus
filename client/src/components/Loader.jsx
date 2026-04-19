import { Loader2 } from "lucide-react";

export const Loader = ({ size = 24, className = "" }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2
        size={size}
        className="animate-spin text-cinema-primary"
      />
    </div>
  );
};

export default Loader;

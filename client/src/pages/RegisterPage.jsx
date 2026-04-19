import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { Film, Mail, Lock, User, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const toastId = toast.loading("Creating your account...");
    
    try {
      await register(form.name, form.email, form.password);
      toast.success("Registration successful! Welcome to Cini Plus.", { id: toastId });
      navigate("/");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to register", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-cinema-primary focus:border-transparent outline-none transition-all placeholder:text-slate-500";

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 -mt-8 relative -mx-8 sm:mx-0 overflow-hidden">
      {/* Abstract Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-slate-950/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-cinema-card/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
               <Film className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-center mb-8">Join Cini Plus and start booking tickets.</p>

          {error && (
            <div className="mb-6 bg-red-950/50 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                required
                type="text"
                placeholder="Full Name"
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                required
                type="email"
                placeholder="Email address"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                required
                type="password"
                placeholder="Password"
                className={inputClass}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            
            <div className="pt-2">
              <Button type="submit" size="lg" className="w-full text-lg" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Register"}
              </Button>
            </div>
          </form>

          <p className="text-center text-slate-400 mt-8 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline transition-all">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

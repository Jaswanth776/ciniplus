import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Film, Mail, Lock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedInput = ({ icon: Icon, type, label, value, onChange, required }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group perspective-1000">
      <motion.div 
        className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition duration-500 ${isFocused ? 'opacity-30 blur-md' : 'group-hover:opacity-20 blur-sm'}`}
      />
      <div className={`relative flex items-center bg-slate-900 border ${isFocused ? 'border-indigo-500' : 'border-slate-700'} rounded-xl transition-colors`}>
        <div className="pl-4">
          <Icon className={`w-5 h-5 transition-colors ${isFocused ? 'text-indigo-400' : 'text-slate-500'}`} />
        </div>
        <div className="relative w-full h-14">
          <motion.label
            initial={false}
            animate={{
              y: isFocused || value ? -10 : 15,
              scale: isFocused || value ? 0.75 : 1,
              opacity: isFocused || value ? 1 : 0.6
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`absolute left-3 top-0 pointer-events-none origin-top-left ${isFocused ? 'text-indigo-400' : 'text-slate-400'}`}
          >
            {label}
          </motion.label>
          <input
            required={required}
            type={type}
            className="w-full h-full bg-transparent text-white px-3 pt-4 pb-1 outline-none relative z-10"
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>
    </div>
  );
};

const ParticleBackground = () => {
  // Generate random particles
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const arr = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setParticles(arr);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep animated gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[30%] -left-[10%] w-[60%] h-[80%] bg-indigo-600/30 blur-[140px] rounded-full" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[50%] -right-[10%] w-[50%] h-[70%] bg-purple-600/30 blur-[130px] rounded-full" 
      />
      
      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-indigo-300 mix-blend-screen"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: ["0%", "-50%", "0%"],
            x: ["0%", "20%", "0%"],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]"></div>
    </div>
  );
};

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setError("");
    setIsLoading(true);
    const toastId = toast.loading("Verifying credentials...");
    
    try {
      await login(form.email, form.password);
      toast.success("Login successful!", { id: toastId });
      
      // Trigger page transition specifically for success state
      setIsExiting(true);
      setTimeout(() => {
        navigate("/");
      }, 700); // Wait for the exit animation duration
      
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to login", { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 -mt-8 relative -mx-8 sm:mx-0 overflow-hidden bg-slate-950">
      
      {/* Core Background with Particles */}
      <ParticleBackground />

      <AnimatePresence>
        {!isExiting && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.6, ease: "easeInOut" } }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-10 w-full max-w-md perspective-1000"
          >
            {/* The Outer Card Glow Wrapper */}
            <motion.div 
              whileHover={{ boxShadow: "0px 0px 40px rgba(99, 102, 241, 0.2)" }}
              className="bg-cinema-card/70 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl transition-all"
            >
              <div className="flex justify-center mb-6 relative">
                <motion.div 
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 15, delay: 0.2 }}
                  className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-2xl border border-indigo-400/30 relative overflow-hidden group"
                >
                  <motion.div 
                    animate={{ left: ["-100%", "200%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 1 }}
                    className="absolute inset-y-0 w-8 bg-white/20 skew-x-12 filter blur-[2px]" 
                  />
                  <Film className="w-10 h-10 text-indigo-400" />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Welcome Back</h2>
                <p className="text-slate-400 text-center mb-8">Sign in to book your favorite movies.</p>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6 bg-red-950/50 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 overflow-hidden"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={onSubmit} className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <AnimatedInput 
                    icon={Mail} 
                    type="email" 
                    label="Email address" 
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required 
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <AnimatedInput 
                    icon={Lock} 
                    type="password" 
                    label="Password" 
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required 
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="pt-2"
                >
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full overflow-hidden rounded-xl text-lg font-semibold text-white group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:from-indigo-500 group-hover:to-purple-500" />
                    
                    {/* Glowing effect on hover */}
                    <motion.div 
                      className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300"
                    />

                    {/* Button Content */}
                    <div className="relative px-6 py-3.5 flex items-center justify-center gap-2">
                       {isLoading ? (
                         <motion.div 
                           animate={{ rotate: 360 }}
                           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                           className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                         />
                       ) : "Sign In"}
                    </div>
                  </motion.button>
                </motion.div>
              </form>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center text-slate-400 mt-8 text-sm"
              >
                Don't have an account?{" "}
                <Link to="/register" className="text-indigo-400 font-medium hover:text-indigo-300 hover:text-shadow-sm transition-all">
                  Register here
                </Link>
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Film, LogOut, Ticket, ShieldAlert } from "lucide-react";
import Button from "./Button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
      isActive
        ? "text-white bg-white/10"
        : "text-slate-300 hover:text-white hover:bg-white/5"
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b-0 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <Film className="w-8 h-8 text-cinema-primary group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Cini Plus
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/bookings" className={navLinkStyle("/bookings")}>
                  <Ticket className="w-4 h-4" />
                  <span className="hidden sm:inline">My Bookings</span>
                </Link>
                
                {user.role === "admin" && (
                  <Link to="/admin" className={navLinkStyle("/admin")}>
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span className="hidden sm:inline text-amber-500/90 hover:text-amber-500">Admin</span>
                  </Link>
                )}

                <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block"></div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end leading-tight">
                    <span className="text-sm font-medium text-white">{user.name}</span>
                    <span className="text-xs text-slate-400">{user.email}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={logout} 
                    title="Logout"
                    className="text-slate-400 hover:text-red-400 hover:bg-red-950/30"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

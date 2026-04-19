import { useEffect, useState, useMemo } from "react";
import { request } from "../api/client";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { 
  LayoutDashboard, Film, Ticket, IndianRupee, Users, 
  TrendingUp, Calendar, AlertCircle, BarChart3, PieChart,
  LogOut, Search, Plus, Edit, Trash2, SlidersHorizontal, Image as ImageIcon, Menu, X
} from "lucide-react";
import toast from "react-hot-toast";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from "recharts";
import { useAuth } from "../context/AuthContext";

// Utility formatting
const formatCurrency = (amt) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amt);

const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  
  const [revenue, setRevenue] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [movieForm, setMovieForm] = useState({
    title: "", language: "Telugu", genre: "", durationMinutes: "", releaseDate: ""
  });
  
  const [showForm, setShowForm] = useState({
    movieId: "", screenId: "", showDate: "", startTime: "", basePrice: ""
  });
  
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    try {
      const [bookingsData, revenueData, moviesData] = await Promise.all([
        request("/admin/bookings"),
        request("/admin/revenue"),
        request("/movies")
      ]);
      setBookings(bookingsData.bookings);
      setRevenue(revenueData.revenue);
      setMovies(moviesData.movies);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const addMovie = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Adding movie...");
    try {
      await request("/movies", { method: "POST", body: JSON.stringify(movieForm) });
      setMovieForm({ title: "", language: "Telugu", genre: "", durationMinutes: "", releaseDate: "" });
      toast.success("Movie added successfully", { id: loadingToast });
      loadAdminData();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Error adding movie", { id: loadingToast });
    }
  };

  const addShow = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Scheduling show...");
    try {
      await request("/shows", { method: "POST", body: JSON.stringify({
        ...showForm,
        movieId: Number(showForm.movieId),
        screenId: Number(showForm.screenId),
        basePrice: Number(showForm.basePrice)
      }) });
      setShowForm({ movieId: "", screenId: "", showDate: "", startTime: "", basePrice: "" });
      toast.success("Show scheduled successfully", { id: loadingToast });
      loadAdminData();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Error scheduling show", { id: loadingToast });
    }
  };

  // Mock data for charts if backend doesn't have time-series yet
  const revenueChartData = useMemo(() => [
    { name: 'Mon', revenue: 4000, tickets: 24 },
    { name: 'Tue', revenue: 3000, tickets: 18 },
    { name: 'Wed', revenue: 2000, tickets: 12 },
    { name: 'Thu', revenue: 2780, tickets: 16 },
    { name: 'Fri', revenue: 18900, tickets: 90 },
    { name: 'Sat', revenue: 23900, tickets: 120 },
    { name: 'Sun', revenue: 34900, tickets: 150 },
  ], []);

  const occupancyData = useMemo(() => [
    { time: 'Morning', rate: 35 },
    { time: 'Afternoon', rate: 60 },
    { time: 'Evening', rate: 95 },
    { time: 'Night', rate: 85 },
  ], []);

  const inputClass = "w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-cinema-primary focus:border-transparent outline-none transition-all placeholder:text-slate-500 shadow-inner";
  const labelClass = "block text-sm font-semibold text-slate-300 mb-1.5";

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-cinema-bg text-slate-100"><Loader size={40} /></div>;
  }

  // Derived stats
  const totalBookings = revenue?.total_bookings || bookings.length;
  const totalRevenue = revenue?.total_revenue || bookings.reduce((sum, b) => sum + Number(b.total_amount), 0);

  // Filter Bookings
  const filteredBookings = bookings.filter(b => 
    b.movie_title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.booking_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-cinema-bg w-full fixed md:absolute left-0 right-0 overflow-hidden z-20 top-16">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 loader-in" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 flex-shrink-0 bg-cinema-card border-r border-slate-800 flex flex-col transition-transform duration-300 overflow-y-auto custom-scrollbar fixed md:static inset-y-0 left-0 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xl tracking-tight">
            <LayoutDashboard className="w-6 h-6" />
            Admin Hub
          </div>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {[
            { id: 'overview', icon: TrendingUp, label: 'Dashboard' },
            { id: 'movies', icon: Film, label: 'Movies' },
            { id: 'shows', icon: Calendar, label: 'Scheduling' },
            { id: 'revenue', icon: IndianRupee, label: 'Revenue' },
            { id: 'analytics', icon: PieChart, label: 'Analytics' },
            { id: 'bookings', icon: Ticket, label: 'Bookings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all font-medium text-sm ${
                activeTab === item.id 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }}
            className="flex items-center gap-3 w-full p-2 hover:bg-slate-800 rounded-lg transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-slate-400 truncate">Administrator</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col bg-[#0b1120] overflow-hidden relative">
        
        {/* Topbar */}
        <header className="h-16 flex-shrink-0 bg-[#0b1120]/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 z-10 w-full">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white capitalize flex items-center gap-2">
              {activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:flex text-slate-400 hover:text-white transition-colors p-2 bg-slate-900 rounded-full border border-slate-800">
              <LogOut className="w-4 h-4" onClick={logout} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {error && (
              <div className="bg-red-950/50 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 shadow-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <p>{error}</p>
              </div>
            )}

            {/* --- DASHBOARD OVERVIEW --- */}
            {activeTab === "overview" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-cinema-card border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-500/20 rounded-xl">
                        <IndianRupee className="w-6 h-6 text-indigo-400" />
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+14%</span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
                  </div>

                  <div className="bg-cinema-card border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <Ticket className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-white">{totalBookings}</p>
                  </div>

                  <div className="bg-cinema-card border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-amber-500/20 rounded-xl">
                        <Film className="w-6 h-6 text-amber-400" />
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Active Movies</p>
                    <p className="text-3xl font-bold text-white">{movies.length}</p>
                  </div>

                  <div className="bg-cinema-card border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-rose-500/20 rounded-xl">
                        <Users className="w-6 h-6 text-rose-400" />
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Daily Active Users</p>
                    <p className="text-3xl font-bold text-white">1,248</p>
                  </div>
                </div>

                {/* Quick Chart Preview */}
                <div className="bg-cinema-card border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="font-bold text-white mb-6">Revenue Trend (Last 7 Days)</h3>
                  <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueChartData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                          itemStyle={{ color: '#818cf8' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {/* --- MOVIES MANAGEMENT --- */}
            {activeTab === "movies" && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-cinema-card border border-slate-800 rounded-2xl p-6 shadow-xl overflow-hidden">
                  <h3 className="font-bold text-white mb-6">Current Movies</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-sm">
                          <th className="pb-3 font-medium">ID / Poster</th>
                          <th className="pb-3 font-medium">Title</th>
                          <th className="pb-3 font-medium">Language</th>
                          <th className="pb-3 font-medium">Duration</th>
                          <th className="pb-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-sm">
                        {movies.map(m => (
                          <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-800 rounded border border-slate-700 flex flex-col items-center justify-center">
                                  <span className="text-[10px] text-slate-500">ID:{m.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 font-bold text-slate-200">{m.title}</td>
                            <td className="py-4 text-slate-400">
                               <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">{m.language}</span>
                            </td>
                            <td className="py-4 text-slate-400">{m.duration_minutes}m</td>
                            <td className="py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button className="p-1.5 bg-slate-800 text-indigo-400 rounded hover:bg-indigo-500/20 transition-colors"><Edit className="w-4 h-4" /></button>
                                <button className="p-1.5 bg-slate-800 text-red-400 rounded hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#121b2e] border border-slate-800 rounded-2xl p-6 shadow-xl h-fit sticky top-0">
                  <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-indigo-400" /> Add New Movie</h3>
                  <form onSubmit={addMovie} className="space-y-4">
                    
                    <div className="w-full h-32 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 mb-6 bg-slate-900/50 hover:bg-slate-800 transition-colors cursor-pointer hover:border-indigo-500/50">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm font-medium">Click to upload poster image</span>
                    </div>

                    <div>
                      <label className={labelClass}>Title</label>
                      <input required placeholder="E.g., Baahubali 2" className={inputClass} value={movieForm.title} onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Language</label>
                        <select className={inputClass} value={movieForm.language} onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}>
                          <option>Telugu</option><option>Tamil</option><option>Kannada</option><option>Malayalam</option><option>Hindi</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Duration (mins)</label>
                        <input required type="number" placeholder="120" className={inputClass} value={movieForm.durationMinutes} onChange={(e) => setMovieForm({ ...movieForm, durationMinutes: e.target.value })} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className={labelClass}>Genre</label>
                         <input required placeholder="Action, Drama" className={inputClass} value={movieForm.genre} onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })} />
                      </div>
                      <div>
                         <label className={labelClass}>Release Date</label>
                         <input required type="date" className={inputClass} value={movieForm.releaseDate} onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })} />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit" size="lg" className="w-full shadow-indigo-500/20">Create Movie Component</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* --- SHOW SCHEDULING --- */}
            {activeTab === "shows" && (
              <div className="bg-cinema-card border border-slate-800 rounded-2xl p-6 shadow-xl max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                     <Calendar className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Schedule Show Time</h3>
                  <p className="text-slate-400 mt-2">Deploy a movie to a specific theatre screen</p>
                </div>

                <form onSubmit={addShow} className="space-y-6">
                  
                  <div className="grid md:grid-cols-2 gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <div>
                      <label className={labelClass}>Select Movie</label>
                      <select required className={inputClass} value={showForm.movieId} onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}>
                        <option value="" disabled>-- Choose a Movie --</option>
                        {movies.map(m => (
                          <option key={m.id} value={m.id}>{m.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Screen Allocation (ID)</label>
                      <input required type="number" placeholder="Enter strictly numerical Screen ID" className={inputClass} value={showForm.screenId} onChange={(e) => setShowForm({ ...showForm, screenId: e.target.value })} />
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Make sure Screen ID exists in the DB</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <div>
                      <label className={labelClass}>Show Date</label>
                      <input required type="date" className={inputClass} value={showForm.showDate} onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>Show Start Time</label>
                      <input required type="time" className={inputClass} value={showForm.startTime} onChange={(e) => setShowForm({ ...showForm, startTime: e.target.value })} />
                    </div>
                  </div>

                  <div className="bg-emerald-900/10 p-6 rounded-2xl border border-emerald-500/20">
                    <label className={labelClass}>Base Pricing Ticket Entry (₹)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <span className="text-slate-400 font-bold">₹</span>
                      </div>
                      <input required type="number" placeholder="E.g., 200" className={`${inputClass} pl-10 border-slate-700 bg-slate-900 focus:ring-emerald-500`} value={showForm.basePrice} onChange={(e) => setShowForm({ ...showForm, basePrice: e.target.value })} />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => setShowForm({ movieId: "", screenId: "", showDate: "", startTime: "", basePrice: "" })}>Clear Fields</Button>
                    <Button type="submit" size="lg" className="px-10">Confirm Schedule</Button>
                  </div>
                </form>
              </div>
            )}

            {/* --- REVENUE DASHBOARD --- */}
            {activeTab === "revenue" && (
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-2xl p-6 shadow-xl shadow-indigo-900/30 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                      <h3 className="text-indigo-100 font-medium mb-1 relative z-10">Total Aggregate Revenue</h3>
                      <p className="text-4xl font-bold mb-4 relative z-10 font-mono tracking-tight">{formatCurrency(totalRevenue)}</p>
                      <div className="bg-white/20 rounded-lg p-3 relative z-10 backdrop-blur-md">
                        <p className="text-sm font-medium">Monthly Target</p>
                        <div className="w-full bg-indigo-900/50 rounded-full h-2 mt-2">
                           <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                        <p className="text-xs text-indigo-100 mt-2 text-right">68% Reached</p>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 bg-cinema-card border border-slate-800 rounded-2xl p-6 shadow-xl">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white">Daily Revenue Analysis</h3>
                        <span className="px-3 py-1 bg-slate-800 rounded-md text-xs font-semibold text-slate-300 border border-slate-700">Last 7 Days</span>
                      </div>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={revenueChartData}>
                            <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                            <RechartsTooltip 
                              cursor={{fill: '#1e293b'}} 
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                            />
                            <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                 </div>
              </div>
            )}

            {/* --- ANALYTICS --- */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="bg-cinema-card border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="font-bold text-white mb-6">Showtime Occupancy Rates</h3>
                  <p className="text-sm text-slate-400 mb-8">Visualizing the average seat fill percentage per time window.</p>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={occupancyData} layout="vertical" barSize={32}>
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis dataKey="time" type="category" stroke="#94a3b8" fontSize={14} width={100} tickLine={false} axisLine={false} />
                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }} />
                        <Bar dataKey="rate" fill="#a855f7" radius={[0, 4, 4, 0]} background={{ fill: '#1e293b' }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* --- BOOKING MANAGEMENT --- */}
            {activeTab === "bookings" && (
              <div className="bg-cinema-card border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full min-h-[60vh]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                   <h3 className="font-bold text-white text-lg flex items-center gap-2"><Ticket className="text-indigo-400" /> Booking Ledger</h3>
                   <div className="relative w-full sm:w-auto">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder="Search Ref, Movie or User..." 
                       className="w-full sm:w-80 bg-slate-900 border border-slate-700 text-sm text-white rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                     />
                   </div>
                </div>

                {!filteredBookings.length ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
                    <SlidersHorizontal className="w-12 h-12 text-slate-600 mb-4" />
                    <p className="text-slate-400 font-medium text-lg">No bookings found</p>
                    <p className="text-sm text-slate-500 mt-1">Try a different search query or wait for orders.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider">
                          <th className="px-6 py-4 font-semibold border-b border-slate-800">Booking Ref</th>
                          <th className="px-6 py-4 font-semibold border-b border-slate-800">Customer</th>
                          <th className="px-6 py-4 font-semibold border-b border-slate-800">Movie</th>
                          <th className="px-6 py-4 font-semibold border-b border-slate-800 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 bg-cinema-card">
                        {filteredBookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4 text-indigo-400 font-mono text-sm font-semibold">
                              #{booking.booking_ref.slice(0, 8).toUpperCase()}...
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-200">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center uppercase text-xs font-bold text-slate-400 border border-slate-700">
                                   {booking.user_name.charAt(0)}
                                </div>
                                {booking.user_name}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-300 font-medium">
                              {booking.movie_title}
                              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {new Date(booking.show_date).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-emerald-400 font-bold text-right backdrop-blur-sm bg-emerald-500/5 rounded-l-md border-l border-emerald-500/10">
                              ₹{booking.total_amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* --- ADMIN PROFILE --- */}
            {activeTab === "profile" && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-cinema-card border border-slate-800 rounded-3xl p-8 shadow-xl text-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                   
                   <div className="relative z-10 w-32 h-32 mx-auto rounded-full bg-slate-900 border-4 border-cinema-card shadow-xl flex items-center justify-center text-5xl font-bold mb-4 text-white uppercase mt-12 bg-gradient-to-br from-slate-800 to-slate-900">
                     {user?.name?.charAt(0) || "A"}
                   </div>
                   
                   <h2 className="text-3xl font-bold text-white mb-2">{user?.name || "System Admin"}</h2>
                   <p className="text-indigo-400 font-medium mb-6 bg-indigo-500/10 inline-block px-4 py-1 rounded-full border border-indigo-500/20">Lead Administrator</p>
                   
                   <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 text-left space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Email Address</p>
                        <p className="text-slate-200">{user?.email || "admin@ciniplus.com"}</p>
                      </div>
                      <div className="border-t border-slate-800 pt-4">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Account Role</p>
                        <p className="text-slate-200 capitalize flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Super Admin
                        </p>
                      </div>
                   </div>

                   <Button variant="outline" className="w-full mt-6 gap-2" onClick={logout}>
                     <LogOut className="w-4 h-4" /> Sign Out from Dashboard
                   </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;

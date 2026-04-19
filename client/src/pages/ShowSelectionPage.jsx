import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { request } from "../api/client";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { MapPin, Calendar, Clock, CreditCard, ChevronRight, Video, ArrowLeft } from "lucide-react";

const ShowSelectionPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShows = async () => {
      try {
        const data = await request(`/shows/${movieId}`);
        setShows(data.shows);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadShows();
  }, [movieId]);

  // Group shows by Theatre for a cleaner BookMyShow style layout
  const groupedShows = shows.reduce((acc, show) => {
    if (!acc[show.theatre_name]) acc[show.theatre_name] = [];
    acc[show.theatre_name].push(show);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors pb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Movie</span>
      </button>

      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Select Show Timing</h2>
          <p className="text-slate-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Pick a screen and time that suits you
          </p>
        </div>
        
        {/* Fake Date Selector Pill */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2">
          {['Today', 'Tomorrow'].map((day, idx) => (
            <div key={day} className={`px-5 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors font-medium ${idx === 0 ? 'bg-cinema-primary text-white border border-indigo-500' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}`}>
              {day}
            </div>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader size={40} />
          <p className="text-slate-400 animate-pulse">Finding the best screens...</p>
        </div>
      ) : error ? (
        <div className="bg-red-950/40 border border-red-500/30 text-red-400 p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-red-500/20 p-3 rounded-full">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Could not load shows</h3>
            <p>{error}</p>
          </div>
        </div>
      ) : shows.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
          <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-300 mb-2">No Active Shows</h3>
          <p className="text-slate-500 mb-6">There are currently no active shows for this movie.</p>
          <Button variant="secondary" onClick={() => navigate(-1)}>View Other Movies</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedShows).map(([theatreName, theatreShows]) => (
            <div key={theatreName} className="bg-cinema-card rounded-2xl p-6 border border-slate-800/60 shadow-lg hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-4 mb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-indigo-400" />
                    {theatreName}
                  </h3>
                  <div className="flex gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> City Center
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400/80">
                      <CreditCard className="w-4 h-4" /> M-Ticket Allowed
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {theatreShows.map((show) => (
                  <Link 
                    key={show.id} 
                    to={`/seats/${show.id}`}
                    className="group flex flex-col items-center p-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-indigo-600/10 hover:border-indigo-500/50 transition-all cursor-pointer min-w-[120px]"
                  >
                    <span className="text-emerald-400 text-xs font-medium mb-1 drop-shadow-sm group-hover:text-emerald-300">
                      ₹{show.base_price}
                    </span>
                    <span className="text-white font-bold group-hover:text-indigo-200">
                      {show.start_time.slice(0, 5)}
                    </span>
                    <span className="text-slate-400 text-xs mt-1 bg-slate-900/50 px-2 py-0.5 rounded">
                      {show.screen_name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowSelectionPage;

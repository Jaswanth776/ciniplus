import { useEffect, useState } from "react";
import { request } from "../api/client";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { Play, Info } from "lucide-react";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await request("/movies");
        setMovies(data.movies);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadMovies();
  }, []);

  const featuredMovie = movies.length > 0 ? movies[0] : null;

  return (
    <div className="-mt-8"> {/* Negative margin to offset App.jsx padding for hero bleed */}
      {/* Hero Section */}
      {featuredMovie && !isLoading ? (
        <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] rounded-b-3xl overflow-hidden mb-12 shadow-2xl shadow-indigo-900/20">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop" 
              alt="Hero Cinema" 
              className="w-full h-full object-cover"
            />
            {/* Cinematic Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]/30"></div>
          </div>
          
          <div className="relative z-10 h-full flex items-center px-4 sm:px-8 lg:px-16 w-full max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 bg-cinema-primary/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold tracking-wider mb-4">
                NOW SHOWING
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                Book the Best <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Movie Experiences
                </span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
                Experience the magic of cinema. Book tickets for Telugu, Tamil, Kannada, and Malayalam blockbusters with ultra-fast seat selection.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="rounded-full px-8 flex items-center gap-2">
                  <Play className="fill-current w-5 h-5" />
                  Book Now
                </Button>
                <Button variant="ghost" size="lg" className="rounded-full px-8 bg-white/10 backdrop-blur-md flex items-center gap-2 border border-white/10 hover:bg-white/20">
                  <Info className="w-5 h-5" />
                  More Info
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          {isLoading && <Loader size={40} />}
        </div>
      )}

      {/* Movies Grid Section */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Recommended Movies</h2>
            <p className="text-slate-400 text-sm">Handpicked blockbusters just for you</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
            <Info className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!error && !isLoading && !movies.length && (
          <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-800">
            <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 text-lg">No movies found. Add movies from admin.</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

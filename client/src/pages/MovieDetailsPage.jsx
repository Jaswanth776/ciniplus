import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { request } from "../api/client";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { Clock, Star, Calendar, Globe, Ticket, ArrowLeft } from "lucide-react";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await request(`/movies/${id}`);
        setMovie(data.movie);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadMovie();
  }, [id]);

  if (error) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="bg-red-500/10 text-red-500 p-6 rounded-xl border border-red-500/30 max-w-md text-center">
        <h2 className="text-xl font-bold mb-2">Error Loading Movie</h2>
        <p>{error}</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );

  if (isLoading || !movie) return <div className="h-[70vh] flex items-center justify-center"><Loader size={48} /></div>;

  // Generic fallback cinematic backdrop
  const backdropUrl = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop";

  return (
    <div className="-mt-8 pb-16">
      {/* Hero Backdrop Setup */}
      <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px]">
        <div className="absolute inset-0">
          <img src={backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-950/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/70 to-transparent"></div>
        </div>

        {/* Content overlaid on backdrop */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col justify-end pb-12">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-8 left-4 lg:left-8 flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Movies</span>
          </button>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start md:items-end">
            <div className="hidden md:block w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 border-2 border-white/10 relative -mb-24 z-10 transition-transform hover:scale-105 duration-500">
              <div className="aspect-[2/3] bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center relative">
                <div className="absolute top-4 left-4 right-4 text-center">
                  <h3 className="text-2xl font-bold text-white/50 break-words opacity-50">{movie.title}</h3>
                </div>
              </div>
            </div>

            <div className="flex-1 pb-4">
              <div className="flex gap-3 flex-wrap mb-4">
                <span className="px-3 py-1 text-sm font-bold bg-amber-500 text-black rounded-md flex items-center gap-1 shadow-lg shadow-amber-500/20">
                  <Star className="w-4 h-4 fill-black" />
                  9.2
                </span>
                <span className="px-3 py-1 text-sm font-semibold bg-white/10 text-white rounded-md backdrop-blur-md border border-white/20">
                  {movie.language}
                </span>
                <span className="px-3 py-1 text-sm font-semibold bg-indigo-500/30 text-indigo-100 rounded-md backdrop-blur-md border border-indigo-500/30 text-transform capitalize">
                  {movie.genre}
                </span>
                <span className="px-3 py-1 text-sm font-semibold bg-white/10 text-white rounded-md backdrop-blur-md border border-white/20">
                  U/A
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                {movie.title}
              </h1>

              <div className="flex items-center text-slate-300 gap-6 mb-8 text-sm sm:text-base font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span>{movie.duration_minutes} Minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <span>{new Date(movie.release_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 hidden sm:flex">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <span>{movie.language} Audio</span>
                </div>
              </div>

              <Link to={`/shows/${movie.id}`}>
                <Button size="lg" className="rounded-full px-8 gap-3 text-lg py-4 w-full sm:w-auto hover:scale-105 active:scale-95 transition-transform shadow-indigo-500/50 hover:shadow-indigo-500/70 shadow-2xl">
                  <Ticket className="w-6 h-6" />
                  Book Tickets Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* About Section */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-cinema-primary rounded-full"></span>
                About the Movie
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg">
                {movie.description || "An immersive cinematic experience. Catch the ultimate blockbuster that brings action, drama, and thrill together in a way you've never experienced before. Book your tickets now and grab the best seats in the house!"}
              </p>
            </section>
          </div>

          {/* Sidebar / Extra Info */}
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4">Top Cast</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold">A</div>
                <div>
                  <p className="text-slate-200 font-medium hover:text-indigo-400 cursor-pointer">Actor Name</p>
                  <p className="text-xs text-slate-500">Lead Role</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold">D</div>
                <div>
                  <p className="text-slate-200 font-medium hover:text-indigo-400 cursor-pointer">Director Name</p>
                  <p className="text-xs text-slate-500">Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;

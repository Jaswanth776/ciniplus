import { Link } from "react-router-dom";
import { Clock, Star, PlayCircle } from "lucide-react";

const MovieCard = ({ movie }) => {
  // Generate a random gradient color based on the title length so it looks varied
  const gradients = [
    "from-purple-900 to-indigo-900",
    "from-blue-900 to-slate-900",
    "from-rose-900 to-red-950",
    "from-emerald-900 to-teal-950",
    "from-amber-900 to-orange-950"
  ];
  const gradient = gradients[movie.title.length % gradients.length];
  
  // Use a fallback unsplash cinematic image
  const posterUrl = movie.posterUrl || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop";

  return (
    <Link to={`/movies/${movie.id}`} className="group relative block w-full rounded-2xl overflow-hidden bg-cinema-card transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] border border-slate-800">
      <div className="aspect-[2/3] w-full relative">
        <img 
          src={posterUrl} 
          alt={movie.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-80 mix-blend-multiply`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent opacity-90"></div>
        
        {/* Play Icon appearing on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
          <PlayCircle className="w-16 h-16 text-white/80 drop-shadow-lg" />
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end h-full">
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="px-2 py-1 text-xs font-semibold bg-white/10 backdrop-blur-md text-white rounded-md border border-white/20">
              {movie.language}
            </span>
            <span className="px-2 py-1 text-xs font-semibold bg-cinema-primary/40 backdrop-blur-md text-indigo-100 rounded-md border border-indigo-500/30">
              {movie.genre}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-md">
            {movie.title}
          </h3>
          
          <div className="flex items-center text-sm text-slate-300 gap-4 mt-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-medium text-slate-200">8.5</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{movie.duration_minutes}m</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;

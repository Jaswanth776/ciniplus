import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../api/client";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { Ticket, Calendar, Clock, MapPin, IndianRupee, MoveRight } from "lucide-react";

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await request("/bookings/user");
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadBookings();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-6">
        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <Ticket className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">My Bookings</h2>
          <p className="text-slate-400 text-sm">View and manage your past and upcoming movie tickets</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><Loader size={48} /></div>
      ) : error ? (
        <div className="bg-red-950/50 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
          <p>{error}</p>
        </div>
      ) : !bookings.length ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
          <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ticket className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-300 mb-2">No Bookings Found</h3>
          <p className="text-slate-500 mb-6">You haven't booked any tickets yet. Let's fix that!</p>
          <Link to="/">
            <Button variant="primary">Browse Movies</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-cinema-card border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-700 transition-colors shadow-lg">
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs font-semibold uppercase tracking-wider mb-2">Confirmed</span>
                    <h3 className="text-2xl font-bold text-white mb-1">{booking.movie_title}</h3>
                    <p className="text-sm font-mono text-indigo-400 font-medium">REF: {booking.booking_ref}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{new Date(booking.show_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{booking.start_time.slice(0, 5)}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className="line-clamp-1">{booking.theatre_name}</span>
                  </div>
                </div>
              </div>

              <div className="flex w-full md:w-auto items-center justify-between gap-6 md:border-l md:border-slate-800 md:pl-6 md:flex-col md:items-end">
                <div className="text-left md:text-right">
                  <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-emerald-400 flex items-center gap-1 md:justify-end">
                    <IndianRupee className="w-5 h-5" />
                    {booking.total_amount}
                  </p>
                </div>
                <Link to={`/booking/confirmation/${booking.booking_ref}`}>
                  <Button variant="outline" className="gap-2">
                    View Ticket <MoveRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { request } from "../api/client";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { ArrowLeft, Coffee, Info, CheckCircle2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

const SeatSelectionPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedFood, setSelectedFood] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [seatData, foodData] = await Promise.all([
          request(`/shows/seats/${showId}`),
          request("/food")
        ]);
        setSeats(seatData.seats);
        setFoodItems(foodData.items.filter((i) => i.is_available));
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load seats");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [showId]);

  const groupedSeats = useMemo(
    () =>
      seats.reduce((acc, seat) => {
        acc[seat.row_label] = acc[seat.row_label] || [];
        acc[seat.row_label].push(seat);
        return acc;
      }, {}),
    [seats]
  );

  const toggleSeat = (showSeatId, status) => {
    if (status !== "available") return;
    setSelected((prev) => {
      if (prev.includes(showSeatId)) {
        return prev.filter((id) => id !== showSeatId);
      }
      if (prev.length >= 10) {
        toast.error("You can only select up to 10 seats.");
        return prev;
      }
      return [...prev, showSeatId];
    });
  };

  const changeFoodQty = (foodItemId, qty) => {
    setSelectedFood((prev) => ({ ...prev, [foodItemId]: Math.max(0, Number(qty)) }));
  };

  const foodTotal = useMemo(() => {
    return Object.entries(selectedFood).reduce((total, [id, qty]) => {
      const item = foodItems.find(i => i.id === Number(id));
      return total + (item ? item.price * qty : 0);
    }, 0);
  }, [selectedFood, foodItems]);

  const confirmBooking = async () => {
    if (selected.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }
    
    setIsBooking(true);
    const toastId = toast.loading("Processing your booking...");

    try {
      const foodPayload = Object.entries(selectedFood)
        .filter(([, quantity]) => quantity > 0)
        .map(([foodItemId, quantity]) => ({ foodItemId: Number(foodItemId), quantity }));

      const data = await request("/bookings", {
        method: "POST",
        body: JSON.stringify({
          showId: Number(showId),
          showSeatIds: selected,
          paymentMethod: "UPI",
          foodItems: foodPayload
        })
      });
      
      toast.success("Booking successful!", { id: toastId });
      setTimeout(() => navigate(`/booking/confirmation/${data.bookingRef}`), 500);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to confirm booking", { id: toastId });
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader size={48} />
        <p className="text-slate-400 font-medium animate-pulse">Preparing the cinema layout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 pb-32 lg:pb-8 animate-in fade-in duration-500">
      {/* Left Column: Seats & Screen */}
      <div className="flex-1">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Change Show</span>
        </button>

        {error && (
          <div className="bg-red-950/50 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-3">
            <Info className="w-5 h-5 flex-shrink-0 text-red-400" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-cinema-card/80 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-x-auto">
          {/* Cinema Screen Curve */}
          <div className="min-w-[500px] max-w-3xl mx-auto mb-16">
            <div className="cinema-screen flex items-end justify-center pb-2">
              <span className="text-indigo-200/50 uppercase tracking-[0.5em] text-sm font-bold shadow-indigo-500 text-shadow-sm">Screen This Way</span>
            </div>
          </div>

          {/* Seat Layout */}
          <div className="min-w-[600px] flex flex-col items-center gap-4 mb-12">
            {Object.keys(groupedSeats).sort().map((row) => (
              <div key={row} className="flex items-center gap-4">
                <span className="w-6 text-center text-slate-500 font-bold text-sm tracking-widest">{row}</span>
                <div className="flex gap-2">
                  {groupedSeats[row].map((seat) => {
                    const isSelected = selected.includes(seat.show_seat_id);
                    const isAvailable = seat.status === "available";
                    
                    return (
                      <button
                        key={seat.show_seat_id}
                        disabled={!isAvailable && !isSelected}
                        className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-semibold rounded-t-xl rounded-b-md transition-all duration-200 flex items-center justify-center border-t-2 ${
                          isSelected 
                            ? "bg-cinema-primary border-indigo-300 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-110 z-10" 
                            : isAvailable 
                              ? "bg-slate-800 border-emerald-500 text-slate-300 hover:bg-emerald-500/20 hover:border-emerald-400" 
                              : "bg-slate-900 border-slate-800 text-transparent opacity-40 cursor-not-allowed"
                        }`}
                        onClick={() => toggleSeat(seat.show_seat_id, seat.status)}
                        title={`Seat ${row}${seat.seat_number} - ${seat.status}`}
                      >
                        {seat.seat_number}
                      </button>
                    );
                  })}
                </div>
                <span className="w-6 text-center text-slate-500 font-bold text-sm tracking-widest">{row}</span>
              </div>
            ))}
          </div>

          {/* Seat Legend */}
          <div className="flex justify-center gap-8 pt-8 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-t-lg rounded-b bg-slate-800 border-t-2 border-emerald-500"></div>
              <span className="text-sm text-slate-400 font-medium">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-t-lg rounded-b bg-cinema-primary border-t-2 border-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              <span className="text-sm text-slate-400 font-medium">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-t-lg rounded-b bg-slate-900 border-t-2 border-slate-800 opacity-40"></div>
              <span className="text-sm text-slate-400 font-medium">Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Add-ons & Summary Summary */}
      <div className="w-full lg:w-96 space-y-6">
        <div className="bg-cinema-card border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Coffee className="w-5 h-5 text-amber-500" />
            Food & Beverages
          </h3>
          
          <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {foodItems.length === 0 ? (
              <p className="text-slate-500 text-sm">No food items available.</p>
            ) : (
              foodItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <div>
                    <p className="font-medium text-slate-200">{item.name}</p>
                    <p className="text-sm text-emerald-400">Rs. {item.price}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-900 rounded-lg p-1">
                    <button 
                      className="w-8 h-8 rounded bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center font-bold disabled:opacity-50"
                      onClick={() => changeFoodQty(item.id, (selectedFood[item.id] || 0) - 1)}
                      disabled={!selectedFood[item.id]}
                    >-</button>
                    <span className="w-6 text-center font-semibold">{selectedFood[item.id] || 0}</span>
                    <button 
                      className="w-8 h-8 rounded bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center font-bold"
                      onClick={() => changeFoodQty(item.id, (selectedFood[item.id] || 0) + 1)}
                    >+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              Booking Summary
            </h3>
            
            <div className="space-y-3 mb-6 flex-1">
              <div className="flex justify-between text-slate-300">
                <span>Selected Seats <span className="font-bold text-white ml-2">{selected.length}</span></span>
                <span className="flex gap-1 flex-wrap justify-end max-w-[150px]">
                  {selected.map(id => {
                    const seat = seats.find(s => s.show_seat_id === id);
                    return seat ? <span key={id} className="text-xs bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">{seat.row_label}{seat.seat_number}</span> : null;
                  })}
                </span>
              </div>
              
              {foodTotal > 0 && (
                <div className="flex justify-between text-slate-300 mt-2">
                  <span>Food & Beverages</span>
                  <span className="font-bold text-white">Rs. {foodTotal}</span>
                </div>
              )}
            </div>

            <Button 
              size="lg" 
              className="w-full py-4 text-lg" 
              onClick={confirmBooking}
              disabled={selected.length === 0 || isBooking}
            >
              {isBooking ? (
                <span className="flex items-center gap-2"><Loader size={20} className="text-white" /> Processing...</span>
              ) : selected.length === 0 ? (
                "Select Seats"
              ) : (
                <span className="flex items-center gap-2 justify-center w-full">
                  Proceed to Payment <CheckCircle2 className="w-5 h-5" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
{/* 
      // Mobile Fixed Bottom Bar (for small screens)
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 lg:hidden z-40 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">{selected.length} Seats</p>
            {foodTotal > 0 && <p className="text-xs text-amber-500">Food: Rs. {foodTotal}</p>}
          </div>
          <Button 
            onClick={confirmBooking}
            disabled={selected.length === 0 || isBooking}
            className="px-8 whitespace-nowrap"
          >
            {isBooking ? "Booking..." : "Proceed"}
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default SeatSelectionPage;

import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Copy, Download, QrCode } from "lucide-react";
import Button from "../components/Button";
import toast from "react-hot-toast";

const BookingConfirmationPage = () => {
  const { bookingRef } = useParams();

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingRef);
    toast.success("Booking reference copied!");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full">
        {/* Ticket Top */}
        <div className="bg-cinema-card rounded-t-3xl p-8 relative border-t border-x border-slate-700">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce-short">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Booking Confirmed!</h2>
          <p className="text-slate-400 text-center mb-8">Your ticket has been booked successfully and sent to your email.</p>
          
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex justify-between items-center mb-2">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Booking Ref</p>
              <p className="text-xl font-mono text-indigo-400 font-bold tracking-widest">{bookingRef}</p>
            </div>
            <button 
              onClick={handleCopy}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              title="Copy Booking ID"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ticket Tear/Divider */}
        <div className="flex bg-cinema-card border-x border-slate-700 relative h-6 overflow-hidden">
          <div className="absolute -left-3 top-[-10px] w-6 h-6 rounded-full bg-cinema-bg border-r border-slate-700"></div>
          <div className="w-full flex items-center px-4">
            <div className="w-full border-t-[2px] border-dashed border-slate-700"></div>
          </div>
          <div className="absolute -right-3 top-[-10px] w-6 h-6 rounded-full bg-cinema-bg border-l border-slate-700"></div>
        </div>

        {/* Ticket Bottom */}
        <div className="bg-cinema-card rounded-b-3xl p-8 border-b border-x border-slate-700 flex flex-col items-center">
          <div className="bg-white p-3 rounded-xl mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <QrCode className="w-32 h-32 text-black" />
          </div>
          <p className="text-sm text-slate-400 text-center mb-8">Please show this QR code or booking reference at the theatre entry.</p>

          <div className="flex gap-4 w-full">
            <Link to="/bookings" className="flex-1">
              <Button variant="secondary" className="w-full gap-2">View Tickets</Button>
            </Link>
            <Button variant="primary" className="flex-1 gap-2" onClick={() => window.print()}>
              <Download className="w-4 h-4" /> Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;

import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import ShowSelectionPage from "./pages/ShowSelectionPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { Toaster } from "react-hot-toast";

const App = () => (
  <div className="min-h-screen bg-cinema-bg text-slate-100 font-sans flex flex-col">
    <Toaster position="top-center" toastOptions={{
      style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }
    }} />
    <Navbar />
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route path="/shows/:movieId" element={<ShowSelectionPage />} />
        <Route
          path="/seats/:showId"
          element={
            <ProtectedRoute>
              <SeatSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/confirmation/:bookingRef"
          element={
            <ProtectedRoute>
              <BookingConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
  </div>
);

export default App;

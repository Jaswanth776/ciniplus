const pool = require("../config/db");

const createBooking = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { showId, showSeatIds, paymentMethod, foodItems = [] } = req.body;
    const userId = req.user.id;

    if (!showId || !Array.isArray(showSeatIds) || showSeatIds.length === 0) {
      return res.status(400).json({ message: "Show and seats are required" });
    }

    await connection.beginTransaction();

    const [showRows] = await connection.execute("SELECT base_price FROM Shows WHERE id = ?", [showId]);
    if (!showRows.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Show not found" });
    }
    const basePrice = Number(showRows[0].base_price);

    const placeholders = showSeatIds.map(() => "?").join(",");
    const [seatRows] = await connection.execute(
      `SELECT id, status FROM Show_Seats WHERE show_id = ? AND id IN (${placeholders}) FOR UPDATE`,
      [showId, ...showSeatIds]
    );

    if (seatRows.length !== showSeatIds.length) {
      await connection.rollback();
      return res.status(400).json({ message: "Some selected seats are invalid for this show" });
    }

    const bookedSeat = seatRows.find((s) => s.status !== "available");
    if (bookedSeat) {
      await connection.rollback();
      return res.status(409).json({ message: "One or more seats already booked" });
    }

    await connection.execute(
      `UPDATE Show_Seats SET status = 'booked' WHERE show_id = ? AND id IN (${placeholders})`,
      [showId, ...showSeatIds]
    );

    const ticketTotal = basePrice * showSeatIds.length;
    let foodTotal = 0;

    const [bookingResult] = await connection.execute(
      "INSERT INTO Bookings (user_id, show_id, total_amount, booking_status) VALUES (?, ?, ?, 'confirmed')",
      [userId, showId, ticketTotal]
    );
    const bookingId = bookingResult.insertId;

    for (const showSeatId of showSeatIds) {
      await connection.execute(
        "INSERT INTO Booking_Seats (booking_id, show_seat_id, seat_price) VALUES (?, ?, ?)",
        [bookingId, showSeatId, basePrice]
      );
    }

    for (const item of foodItems) {
      const [foodRows] = await connection.execute(
        "SELECT id, price, is_available FROM Food_Items WHERE id = ?",
        [item.foodItemId]
      );
      if (!foodRows.length || !foodRows[0].is_available) {
        await connection.rollback();
        return res.status(400).json({ message: "Invalid or unavailable food item selected" });
      }
      const quantity = Number(item.quantity || 1);
      const lineTotal = Number(foodRows[0].price) * quantity;
      foodTotal += lineTotal;
      await connection.execute(
        "INSERT INTO Food_Orders (booking_id, food_item_id, quantity, item_price, total_price) VALUES (?, ?, ?, ?, ?)",
        [bookingId, item.foodItemId, quantity, foodRows[0].price, lineTotal]
      );
    }

    const finalTotal = ticketTotal + foodTotal;
    const bookingRef = `CP${Date.now()}${bookingId}`;

    await connection.execute("UPDATE Bookings SET total_amount = ?, booking_ref = ? WHERE id = ?", [
      finalTotal,
      bookingRef,
      bookingId
    ]);

    await connection.execute(
      "INSERT INTO Payments (booking_id, amount, payment_method, payment_status) VALUES (?, ?, ?, 'paid')",
      [bookingId, finalTotal, paymentMethod || "UPI"]
    );

    await connection.commit();
    return res.status(201).json({
      message: "Booking confirmed",
      bookingId,
      bookingRef,
      totalAmount: finalTotal
    });
  } catch (error) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT b.id, b.booking_ref, b.total_amount, b.booking_status, b.created_at,
      m.title AS movie_title, s.show_date, s.start_time, t.name AS theatre_name
      FROM Bookings b
      JOIN Shows s ON b.show_id = s.id
      JOIN Movies m ON s.movie_id = m.id
      JOIN Screens sc ON s.screen_id = sc.id
      JOIN Theatres t ON sc.theatre_id = t.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    return res.status(200).json({ bookings: rows });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings
};

CREATE DATABASE IF NOT EXISTS cini_plus;
USE cini_plus;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  admin_level VARCHAR(50) DEFAULT 'supervisor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  language ENUM('Telugu', 'Tamil', 'Kannada', 'Malayalam') NOT NULL,
  genre VARCHAR(100) NOT NULL,
  duration_minutes INT NOT NULL,
  description TEXT,
  poster_url VARCHAR(500),
  release_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Theatres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Screens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  theatre_id INT NOT NULL,
  screen_name VARCHAR(100) NOT NULL,
  total_rows INT NOT NULL,
  seats_per_row INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (theatre_id) REFERENCES Theatres(id) ON DELETE CASCADE
);

CREATE TABLE Shows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  screen_id INT NOT NULL,
  show_date DATE NOT NULL,
  start_time TIME NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (movie_id) REFERENCES Movies(id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES Screens(id) ON DELETE CASCADE
);

CREATE TABLE Seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  screen_id INT NOT NULL,
  row_label CHAR(1) NOT NULL,
  seat_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_screen_seat (screen_id, row_label, seat_number),
  FOREIGN KEY (screen_id) REFERENCES Screens(id) ON DELETE CASCADE
);

CREATE TABLE Show_Seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  show_id INT NOT NULL,
  seat_id INT NOT NULL,
  status ENUM('available', 'booked') DEFAULT 'available',
  lock_expires_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_show_seat (show_id, seat_id),
  FOREIGN KEY (show_id) REFERENCES Shows(id) ON DELETE CASCADE,
  FOREIGN KEY (seat_id) REFERENCES Seats(id) ON DELETE CASCADE
);

CREATE TABLE Bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_ref VARCHAR(50) UNIQUE NULL,
  user_id INT NOT NULL,
  show_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  booking_status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (show_id) REFERENCES Shows(id) ON DELETE RESTRICT
);

CREATE TABLE Booking_Seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  show_seat_id INT NOT NULL,
  seat_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_booking_showseat (booking_id, show_seat_id),
  FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (show_seat_id) REFERENCES Show_Seats(id) ON DELETE RESTRICT
);

CREATE TABLE Payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE
);

CREATE TABLE Food_Items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Food_Orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  food_item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  item_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (food_item_id) REFERENCES Food_Items(id) ON DELETE RESTRICT
);

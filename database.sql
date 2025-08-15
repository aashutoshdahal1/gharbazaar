-- USERS
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- LISTINGS
CREATE TABLE listings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type ENUM('land', 'room', 'flat', 'house') NOT NULL,
  purpose ENUM('rent', 'buy', 'sell') NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  area VARCHAR(100),
  phone_number VARCHAR(20),
  images TEXT,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- MESSAGES
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  listing_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

-- COMMENTS
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  listing_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- RATINGS
CREATE TABLE ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  listing_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (listing_id, user_id),
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- REPORTS
CREATE TABLE reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reporter_id INT, 
  reported_user_id INT,
  reported_listing_id INT,
  reason TEXT NOT NULL,
  status ENUM('pending', 'reviewed', 'dismissed') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reported_listing_id) REFERENCES listings(id) ON DELETE SET NULL
);


-- OPTIONAL: SEARCH LOGS
CREATE TABLE search_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  query TEXT NOT NULL,
  searched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default admin user
-- Password is 'admin123' (hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@gharbazaar.com', '$2b$10$dow6q2fhX0qqUv.OOvzhdOVC0qZvpAOxBwmqy7A/zP.i8l5Kh2uEq', 'admin')
ON DUPLICATE KEY UPDATE 
name = VALUES(name), 
role = VALUES(role);

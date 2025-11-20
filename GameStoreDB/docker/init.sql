-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  platforms TEXT NOT NULL,
  release_date DATE,
  image_url TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category);
CREATE INDEX IF NOT EXISTS idx_games_created_by ON games(created_by);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert sample data
-- For testing only - in production use proper bcrypt hashes
INSERT INTO users (username, password, email, is_admin) VALUES 
('Admin', 'Admin123', 'admin@gamestore.com', TRUE),
('testuser', 'testuser123', 'testuser@gamestore.com', FALSE)
ON CONFLICT (username) DO NOTHING;

-- Insert sample games with image_url
INSERT INTO games (title, price, category, platforms, release_date, image_url, created_by) VALUES
('Football Manager 2026', 1599.00, 'กีฬา', 'PC (Steam),PC (Epic)', '2025-11-06', '/assets/games/fm26.jpg', 1),
('Borderlands 4', 1890.00, 'ยิง FPS', 'PC (Steam),PlayStation 5,Xbox Series X|S', '2025-12-25', '/assets/games/bdl4.jpg', 1),
('Lost Soul Aside', 1899.00, 'แอคชั่น', 'PlayStation 5,PC (Epic)', '2026-01-15', '/assets/games/lsa.jpg', 1),
('Metal Gear Solid Δ: Snake Eater', 1899.00, 'แอคชั่น', 'PlayStation 5,PC (Steam)', '2025-11-20', '/assets/games/metal.jpg', 1),
('Grand Theft Auto VI', 2590.00, 'แอคชั่น', 'PC (Steam),PlayStation 5,Xbox Series X|S', '2025-09-14', '/assets/GameIcon.jpg', 1),
('Monster Hunter Wilds', 1890.00, 'เล่นตามบทบาท RPG', 'PC (Steam),PC (Epic)', '2025-02-28', '/assets/games/monster.jpg', 1),
('Red Dead Redemption', 1990.00, 'ผจญภัย', 'PC (Steam),PlayStation 5,Xbox Series X|S', '2018-10-26', '/assets/GameIcon.jpg', 1),
('Baldurs Gate 3', 2290.00, 'เล่นตามบทบาท RPG', 'PC (Steam)', '2023-08-03', '/assets/GameIcon.jpg', 1),
('Need for Speed Heat', 1899.00, 'กีฬา', 'PC (Steam)', '2019-11-08', '/assets/games/needfs.jpg', 1),
('Far Cry 6', 1599.00, 'แอคชั่น', 'PC (Steam),PC (Epic)', '2021-10-07', '/assets/games/far-cry-6-cover.jpg', 1),
('Sifu', 539.00, 'แอคชั่น', 'PC (Epic)', '2022-02-08', '/assets/games/sifu-cover.jpg', 1),
('Battlefield 1', 599.00, 'ยิง FPS', 'PC (Steam)', '2016-10-21', '/assets/games/battlefield-1-cover.jpg', 1),
('EA SPORTS FC 24', 1899.00, 'กีฬา', 'PC (Steam),Xbox Series X|S,PlayStation 5', '2023-09-29', '/assets/games/ea-sports-fc-24-cover.jpg', 1),
('Assassins Creed Valhalla', 1599.00, 'แอคชั่น', 'PC (Steam),Xbox Series X|S,PlayStation 5', '2020-11-10', '/assets/games/assassins-creed-valhalla-cover.jpg', 1),
('Watch Dogs Legion', 1590.00, 'แอคชั่น', 'PC (Steam),Xbox Series X|S,PlayStation 5', '2020-10-29', '/assets/games/watch-dogs-legion-cover.jpg', 1)
ON CONFLICT DO NOTHING;

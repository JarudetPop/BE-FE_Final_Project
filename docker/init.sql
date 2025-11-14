-- ลบตารางเก่าทั้งหมด
DROP TABLE IF EXISTS game_platforms, games, platforms, categories;

-- ตารางหลัก
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL
);
CREATE TABLE platforms (
    platform_id SERIAL PRIMARY KEY,
    platform_name VARCHAR(50) UNIQUE NOT NULL
);
CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    price INT NOT NULL,
    release_date DATE,
    image_url TEXT,
    category_id INT REFERENCES categories(category_id)
);
CREATE TABLE game_platforms (
    game_id INT REFERENCES games(game_id),
    platform_id INT REFERENCES platforms(platform_id),
    PRIMARY KEY (game_id, platform_id)
);

-- ข้อมูลเริ่มต้น
INSERT INTO categories (category_name) VALUES
('แอคชั่น'), ('ผจญภัย'), ('กีฬา'), ('ยิง FPS'),
('สร้าง/จำลอง'), ('สยองขวัญ'), ('เล่นตามบทบาท RPG'),
('แข่งรถ'), ('เซอร์ไววัล');

INSERT INTO platforms (platform_name) VALUES
('PC (Steam)'), ('PC (Epic)'), ('PlayStation 5'),
('PlayStation 4'), ('Xbox Series X|S'), ('Xbox One'), ('Nintendo Switch');

-- ข้อมูลเกม (ย่อรูปแบบ SELECT category_id)
INSERT INTO games (title, price, release_date, category_id) VALUES
('Football Manager 2026',1599,'2025-11-06',(SELECT category_id FROM categories WHERE category_name='กีฬา')),
('Borderlands 4',1890,'2025-12-25',(SELECT category_id FROM categories WHERE category_name='ยิง FPS')),
('Lost Soul Aside',1899,'2026-01-15',(SELECT category_id FROM categories WHERE category_name='แอคชั่น')),
('Stardew Valley',369,'2016-02-26',(SELECT category_id FROM categories WHERE category_name='สร้าง/จำลอง')),
('Minecraft',990,'2011-11-18',(SELECT category_id FROM categories WHERE category_name='สร้าง/จำลอง')),
('Monster Hunter Wilds',1999,'2025-12-10',(SELECT category_id FROM categories WHERE category_name='แอคชั่น')),
('ARK: Survival Ascended',1100,'2023-10-26',(SELECT category_id FROM categories WHERE category_name='เซอร์ไววัล')),
('Cities Skylines II',1199,'2023-10-24',(SELECT category_id FROM categories WHERE category_name='สร้าง/จำลอง')),
('Planet Zoo',990,'2019-11-05',(SELECT category_id FROM categories WHERE category_name='สร้าง/จำลอง')),
('Grand Theft Auto V',699,'2013-09-17',(SELECT category_id FROM categories WHERE category_name='แอคชั่น')),
('Red Dead Redemption 2',1599,'2018-10-26',(SELECT category_id FROM categories WHERE category_name='ผจญภัย')),
('Dead by Daylight',399,'2016-06-14',(SELECT category_id FROM categories WHERE category_name='สยองขวัญ')),
('Resident Evil Village',1199,'2021-05-07',(SELECT category_id FROM categories WHERE category_name='สยองขวัญ')),
('Outlast',315,'2013-09-04',(SELECT category_id FROM categories WHERE category_name='สยองขวัญ')),
('Outlast 2',599,'2017-04-25',(SELECT category_id FROM categories WHERE category_name='สยองขวัญ')),
('Clair Obscur: Expedition 33',1790,'2026-03-01',(SELECT category_id FROM categories WHERE category_name='เล่นตามบทบาท RPG')),
('BattleField 6',1999,'2026-03-10',(SELECT category_id FROM categories WHERE category_name='ยิง FPS')),
('Farming Simulator 25',1290,'2024-11-12',(SELECT category_id FROM categories WHERE category_name='สร้าง/จำลอง')),
('Dark Souls III',1290,'2016-03-24',(SELECT category_id FROM categories WHERE category_name='เล่นตามบทบาท RPG')),
('Elden Ring',1790,'2022-02-25',(SELECT category_id FROM categories WHERE category_name='เล่นตามบทบาท RPG')),
('Helldivers 2',1160,'2024-02-08',(SELECT category_id FROM categories WHERE category_name='ยิง FPS')),
('Forza Horizon 6',1799,'2026-09-30',(SELECT category_id FROM categories WHERE category_name='แข่งรถ')),
('Terraria',289,'2011-05-16',(SELECT category_id FROM categories WHERE category_name='เซอร์ไววัล')),
('Cyberpunk 2077',1799,'2020-12-10',(SELECT category_id FROM categories WHERE category_name='เล่นตามบทบาท RPG')),
('Ghost of Tsushima',1690,'2020-07-17',(SELECT category_id FROM categories WHERE category_name='แอคชั่น')),
('Hogwarts Legacy',1690,'2023-02-10',(SELECT category_id FROM categories WHERE category_name='เล่นตามบทบาท RPG')),
('No Man''s Sky',1049,'2016-08-12',(SELECT category_id FROM categories WHERE category_name='ผจญภัย')),
('God of War',1190,'2018-04-20',(SELECT category_id FROM categories WHERE category_name='แอคชั่น')),
('7 Days to Die',369,'2013-12-13',(SELECT category_id FROM categories WHERE category_name='เซอร์ไววัล')),
('The Last of Us Part II',1690,'2020-06-19',(SELECT category_id FROM categories WHERE category_name='ผจญภัย'));

INSERT INTO game_platforms (game_id, platform_id) VALUES
-- 1. Football Manager 2026
((SELECT game_id FROM games WHERE title = 'Football Manager 2026'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Football Manager 2026'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Epic)')),

-- 2. Borderlands 4
((SELECT game_id FROM games WHERE title = 'Borderlands 4'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Borderlands 4'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Borderlands 4'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 3. Lost Soul Aside
((SELECT game_id FROM games WHERE title = 'Lost Soul Aside'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Lost Soul Aside'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Epic)')),

-- 4. Stardew Valley
((SELECT game_id FROM games WHERE title = 'Stardew Valley'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Stardew Valley'), (SELECT platform_id FROM platforms WHERE platform_name = 'Nintendo Switch')),
((SELECT game_id FROM games WHERE title = 'Stardew Valley'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 4')),
((SELECT game_id FROM games WHERE title = 'Stardew Valley'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox One')),

-- 5. Minecraft
((SELECT game_id FROM games WHERE title = 'Minecraft'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Minecraft'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 4')),
((SELECT game_id FROM games WHERE title = 'Minecraft'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox One')),
((SELECT game_id FROM games WHERE title = 'Minecraft'), (SELECT platform_id FROM platforms WHERE platform_name = 'Nintendo Switch')),

-- 6. Monster Hunter Wilds
((SELECT game_id FROM games WHERE title = 'Monster Hunter Wilds'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Monster Hunter Wilds'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Monster Hunter Wilds'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 7. ARK: Survival Ascended
((SELECT game_id FROM games WHERE title = 'ARK: Survival Ascended'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'ARK: Survival Ascended'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'ARK: Survival Ascended'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 8. Cities Skylines II
((SELECT game_id FROM games WHERE title = 'Cities Skylines II'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Cities Skylines II'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Cities Skylines II'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 9. Planet Zoo
((SELECT game_id FROM games WHERE title = 'Planet Zoo'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Planet Zoo'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Planet Zoo'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 10. Grand Theft Auto V
((SELECT game_id FROM games WHERE title = 'Grand Theft Auto V'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Grand Theft Auto V'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Grand Theft Auto V'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 11. Red Dead Redemption 2
((SELECT game_id FROM games WHERE title = 'Red Dead Redemption 2'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Red Dead Redemption 2'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 4')),
((SELECT game_id FROM games WHERE title = 'Red Dead Redemption 2'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox One')),

-- 12. Dead by Daylight
((SELECT game_id FROM games WHERE title = 'Dead by Daylight'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Dead by Daylight'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Dead by Daylight'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),
((SELECT game_id FROM games WHERE title = 'Dead by Daylight'), (SELECT platform_id FROM platforms WHERE platform_name = 'Nintendo Switch')),

-- 13. Resident Evil Village
((SELECT game_id FROM games WHERE title = 'Resident Evil Village'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Resident Evil Village'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Resident Evil Village'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 14. Outlast
((SELECT game_id FROM games WHERE title = 'Outlast'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Outlast'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 4')),
((SELECT game_id FROM games WHERE title = 'Outlast'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox One')),

-- 15. Outlast 2
((SELECT game_id FROM games WHERE title = 'Outlast 2'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Outlast 2'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 4')),
((SELECT game_id FROM games WHERE title = 'Outlast 2'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox One')),

-- 16. Clair Obscur: Expedition 33
((SELECT game_id FROM games WHERE title = 'Clair Obscur: Expedition 33'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Clair Obscur: Expedition 33'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Clair Obscur: Expedition 33'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 17. BattleField 6
((SELECT game_id FROM games WHERE title = 'BattleField 6'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'BattleField 6'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'BattleField 6'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 18. Farming Simulator 25
((SELECT game_id FROM games WHERE title = 'Farming Simulator 25'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Farming Simulator 25'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Farming Simulator 25'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 19. Dark Souls III
((SELECT game_id FROM games WHERE title = 'Dark Souls III'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Dark Souls III'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 4')),
((SELECT game_id FROM games WHERE title = 'Dark Souls III'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox One')),

-- 20. Elden Ring
((SELECT game_id FROM games WHERE title = 'Elden Ring'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Elden Ring'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Elden Ring'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 21. Helldivers 2
((SELECT game_id FROM games WHERE title = 'Helldivers 2'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Helldivers 2'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),

-- 22. Forza Horizon 6
((SELECT game_id FROM games WHERE title = 'Forza Horizon 6'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Forza Horizon 6'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 23. Terraria
((SELECT game_id FROM games WHERE title = 'Terraria'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Terraria'), (SELECT platform_id FROM platforms WHERE platform_name = 'Nintendo Switch')),
((SELECT game_id FROM games WHERE title = 'Terraria'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 4')),
((SELECT game_id FROM games WHERE title = 'Terraria'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox One')),

-- 24. Cyberpunk 2077
((SELECT game_id FROM games WHERE title = 'Cyberpunk 2077'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Cyberpunk 2077'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Cyberpunk 2077'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 25. Ghost of Tsushima
((SELECT game_id FROM games WHERE title = 'Ghost of Tsushima'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Ghost of Tsushima'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),

-- 26. Hogwarts Legacy
((SELECT game_id FROM games WHERE title = 'Hogwarts Legacy'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'Hogwarts Legacy'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'Hogwarts Legacy'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),
((SELECT game_id FROM games WHERE title = 'Hogwarts Legacy'), (SELECT platform_id FROM platforms WHERE platform_name = 'Nintendo Switch')),

-- 27. No Man's Sky
((SELECT game_id FROM games WHERE title = 'No Man''s Sky'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'No Man''s Sky'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 5')),
((SELECT game_id FROM games WHERE title = 'No Man''s Sky'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox Series X|S')),

-- 28. God of War
((SELECT game_id FROM games WHERE title = 'God of War'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = 'God of War'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 4')),

-- 29. 7 Days to Die
((SELECT game_id FROM games WHERE title = '7 Days to Die'), (SELECT platform_id FROM platforms WHERE platform_name = 'PC (Steam)')),
((SELECT game_id FROM games WHERE title = '7 Days to Die'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 4')),
((SELECT game_id FROM games WHERE title = '7 Days to Die'), (SELECT platform_id FROM platforms WHERE platform_name = 'Xbox One')),

-- 30. The Last of Us Part II
((SELECT game_id FROM games WHERE title = 'The Last of Us Part II'), (SELECT platform_id FROM platforms WHERE platform_name = 'PlayStation 4'));

UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/232090/header.jpg' WHERE title='Football Manager 2026'; -- ใช้ FM24 ชั่วคราว
UPDATE games SET image_url='https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1285190/986a88d1b0e1420b00183def2a7034508353afa3/header.jpg?t=1761055619' WHERE title='Borderlands 4'; -- ใช้ Borderlands 3 ชั่วคราว
UPDATE games SET image_url='https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3378960/header.jpg?t=1756465896' WHERE title='Lost Soul Aside';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg' WHERE title='Stardew Valley';
UPDATE games SET image_url='https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/key-art/Homepage_Discover-our-games_MC-Vanilla-KeyArt_864x864.jpg' WHERE title='Minecraft';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/2246340/header.jpg' WHERE title='Monster Hunter Wilds';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/2399830/header.jpg' WHERE title='ARK: Survival Ascended';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/949230/header.jpg' WHERE title='Cities Skylines II';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/703080/header.jpg' WHERE title='Planet Zoo';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg' WHERE title='Grand Theft Auto V';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg' WHERE title='Red Dead Redemption 2';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/381210/header.jpg' WHERE title='Dead by Daylight';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/1196590/header.jpg' WHERE title='Resident Evil Village';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/238320/header.jpg' WHERE title='Outlast';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/414700/header.jpg' WHERE title='Outlast 2';
UPDATE games SET image_url='https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1903340/be3305b02d4db0dffa3458537118423bf2792d7e/header.jpg?t=1762765069' WHERE title='Clair Obscur: Expedition 33'; -- placeholders จาก trailer key art
UPDATE games SET image_url='https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2807960/c12d12ce3c7d217398d3fcad77427bfc9d57c570/header.jpg?t=1762451773' WHERE title='BattleField 6'; -- ใช้ BF2042 ชั่วคราว
UPDATE games SET image_url='https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2300320/header.jpg?t=1761296764' WHERE title='Farming Simulator 25'; -- ใช้ FS22 ชั่วคราว
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg' WHERE title='Dark Souls III';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg' WHERE title='Elden Ring';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg' WHERE title='Helldivers 2';
UPDATE games SET image_url='https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2483190/1acaf078d452ab11660b31c4716ac818a2e02680/header.jpg?t=1759247866' WHERE title='Forza Horizon 6'; -- ใช้ FH5 ชั่วคราว
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg' WHERE title='Terraria';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg' WHERE title='Cyberpunk 2077';
UPDATE games SET image_url='https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/header.jpg?t=1761681181' WHERE title='Ghost of Tsushima';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg' WHERE title='Hogwarts Legacy';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/275850/header.jpg' WHERE title='No Man''s Sky';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg' WHERE title='God of War';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/251570/header.jpg' WHERE title='7 Days to Die';
UPDATE games SET image_url='https://cdn.cloudflare.steamstatic.com/steam/apps/1281940/header.jpg' WHERE title='The Last of Us Part II'; -- ใช้ Part I ชั่วคราว

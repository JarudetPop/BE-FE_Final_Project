import React, { useState, useEffect } from 'react';
import '../App.css';
import '../styles/newgame.css';

function Newgame() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [allGames, setAllGames] = useState([]);

  // ดึงเกมล่าสุดจาก Backend
  useEffect(() => {
    fetch('http://localhost:8080/api/games/latest')
      .then(res => res.json())
      .then(data => {
        setAllGames(data);
        setFilteredGames(data);
      })
      .catch(err => console.error("Fetch Latest Games Error:", err));
  }, []);

  // เรียงแพลตฟอร์ม
  const platformOrder = [
    "PC (Steam)",
    "PC (Epic)",
    "PlayStation 5",
    "PlayStation 4",
    "Xbox Series X|S",
    "Xbox One",
    "Nintendo Switch"
  ];

  const categories = ['all', ...new Set(allGames.map(game => game.category_name))];
  const platforms = ['all', ...new Set(allGames.flatMap(game => game.platforms))]
    .sort((a, b) => {
      if (a === 'all') return -1;
      if (b === 'all') return 1;
      return platformOrder.indexOf(a) - platformOrder.indexOf(b);
    });

  // Filter
  useEffect(() => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    let result = [...allGames];

    // เฉพาะเกมที่ยังไม่ออก หรือ ออกไม่เกิน 1 เดือน
    result = result.filter(game => {
      const releaseDate = new Date(game.release_date);
      return releaseDate >= oneMonthAgo || releaseDate > now;
    });

    if (searchQuery) {
      result = result.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(game => game.category_name === selectedCategory);
    }

    if (selectedPlatform !== 'all') {
      result = result.filter(game => game.platforms.includes(selectedPlatform));
    }

    setFilteredGames(result);
  }, [searchQuery, selectedCategory, selectedPlatform, allGames]);

  return (
    <div className="newgame-container">

      {/* ▶ Search Section */}
      <div className="search-section">
        <h1>เกมใหม่ล่าสุด</h1>
        <p>เลือกดูเกมที่เพิ่งวางขายหรือกำลังจะออกเร็ว ๆ นี้</p>

        <div className="search-controls">
          <div className="search-input">
            <input
              type="text"
              placeholder="ค้นหาเกม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>

          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'ทุกหมวดหมู่' : cat}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            {platforms.map(plat => (
              <option key={plat} value={plat}>
                {plat === 'all' ? 'ทุกแพลตฟอร์ม' : plat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ▶ Games Grid */}
      <div className="games-grid">
        {filteredGames.length > 0 ? (
          filteredGames.map(game => {
            const releaseDate = new Date(game.release_date);
            const now = new Date();
            const isUpcoming = releaseDate > now;

            return (
              <div key={game.game_id} className="game-card">
                <div className="image-wrapper">
                  <img src={game.image_url} alt={game.title} className="game-image" />
                  {isUpcoming && <span className="coming-soon-badge">COMING SOON</span>}
                </div>

                <div className="game-info">
                  <h3 className="game-title">{game.title}</h3>
                  <p className="game-category">
                    {game.category_name} • วางจำหน่าย {releaseDate.toLocaleDateString('th-TH')}
                  </p>

                  <p className="game-price">฿{game.price}</p>

                  <div className="platform-buttons">
                    {game.platforms
                      .sort((a, b) => platformOrder.indexOf(a) - platformOrder.indexOf(b))
                      .map(platform => (
                        <button key={platform} className="platform-button">
                          {platform}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <i className="fas fa-search fa-3x mb-4"></i>
            <p>ไม่พบเกมที่คุณค้นหา</p>
          </div>
        )}
      </div>

      {/* ▶ Footer */}
      <footer className="footer">
        <p>
          &copy; Copyright © 2025 i HAVE GAME.
          All Rights Reserved. For educational purposes in Backend - Frontend only.
        </p>
      </footer>
    </div>
  );
}

export default Newgame;

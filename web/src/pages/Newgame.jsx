import React, { useState, useEffect } from 'react';
import walLeftImage from '../assets/wal-left.jpg';
import walRightImage from '../assets/wal-right.jpg';

import '../App.css';
import '../styles/newgame.css';

const API_BASE_URL = 'http://localhost:8080/api';

function Newgame() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch games from API on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/games`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setAllGames(data);
          setError('');
        } else {
          setAllGames([]);
        }
      } else {
        setError('ไม่สามารถโหลดรายการเกมได้');
      }
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('ข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBuyClick = (game) => {
    alert(`เพิ่ม ${game.title} ลงในตะกร้าแล้ว\nราคา: ฿${game.price}`);
  };

  // Map API response to display format
  const mapGameData = (apiGame) => {
    const categoryMap = {
      'แอคชั่น': 'Action',
      'ผจญภัย': 'Adventure',
      'กีฬา': 'Sports',
      'ยิง FPS': 'FPS',
      'แข่งรถ': 'Racing',
      'เล่นตามบทบาท RPG': 'RPG',
      'วางแผนกลยุทธ์': 'Strategy'
    };

    const platformMap = {
      'PC (Steam)': 'Steam',
      'PC (Epic)': 'Epic Games',
      'PlayStation 5': 'PS5',
      'Xbox Series X|S': 'Xbox',
      'Nintendo Switch': 'Switch'
    };

    return {
      id: apiGame.id,
      title: apiGame.title,
      price: apiGame.price,
      category: categoryMap[apiGame.category] || apiGame.category,
      releaseDate: apiGame.release_date,
      imageUrl: apiGame.image_url || '',
      platforms: Array.isArray(apiGame.platforms) 
        ? apiGame.platforms.map(p => platformMap[p] || p)
        : apiGame.platforms.split(',').map(p => platformMap[p.trim()] || p.trim())
    };
  };

  const categories = ['all', 'Action', 'Adventure', 'Sports', 'FPS', 'Racing', 'RPG', 'Strategy'];
  const platforms = ['all', 'Steam', 'Epic Games', 'PS5', 'Xbox', 'Switch'];

  // Filter games based on search query, category, and platform
  useEffect(() => {
    let filtered = allGames.map(mapGameData);

    if (searchQuery) {
      filtered = filtered.filter(game => 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(game => game.category === selectedCategory);
    }

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(game => game.platforms.includes(selectedPlatform));
    }

    setFilteredGames(filtered);
  }, [searchQuery, selectedCategory, selectedPlatform, allGames]);

  return (
    <div className="newgame-container">
      <div className="search-section">
        <h1>เกมทั้งหมด</h1>
        <p>ค้นพบเกมใหม่ที่น่าตื่นเต้นและพร้อมให้คุณได้สัมผัสประสบการณ์</p>
        
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">กำลังโหลด...</div>}
        
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
            <option value="all">ทุกหมวดหมู่</option>
            {categories.filter(cat => cat !== 'all').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select 
            className="filter-select"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            <option value="all">ทุกแพลตฟอร์ม</option>
            {platforms.filter(plat => plat !== 'all').map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="section-with-sidebar">
        <div className="section-sidebar left">
          <div className="side-banner" style={{backgroundImage: `url(${walLeftImage})`}}></div>
        </div>

        <section className="roblox-section">
          <div className="roblox-grid">
          {!loading && filteredGames.length > 0 ? (
            filteredGames.map(game => (
              <div key={game.id} className="roblox-card">
                <div className="roblox-image">
                  {game.imageUrl ? (
                    <img src={game.imageUrl} alt={game.title} />
                  ) : (
                    <div className="game-placeholder">{game.title}</div>
                  )}
                </div>
                <div className="roblox-info">
                  <div className="roblox-title">{game.title}</div>
                  <div className="game-category">{game.category}</div>
                  <div className="price-button-container">
                    <div className="roblox-price">฿{game.price.toFixed(0)}</div>
                    <button className="buy-btn" onClick={() => handleBuyClick(game)}>ซื้อเลย</button>
                  </div>
                </div>
              </div>
            ))
          ) : !loading && (
            <div className="no-results">
              <i className="fas fa-search fa-3x mb-4"></i>
              <p>ไม่พบเกมที่คุณค้นหา</p>
            </div>
          )}
        </div>
        </section>

        <div className="section-sidebar right">
          <div className="side-banner" style={{backgroundImage: `url(${walRightImage})`}}></div>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; Copyright © 2025 i HAVE GAME. All Rights Reserved. For educational purposes in Backend - Frontend only.</p>
      </footer>
    </div>
  );
}

export default Newgame;

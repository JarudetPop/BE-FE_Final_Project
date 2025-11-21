import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import walLeftImage from '../assets/wal-left.jpg';
import walRightImage from '../assets/wal-right.jpg';

import '../App.css';
import '../styles/newgame.css';

// API base URL
const API_BASE_URL = 'http://localhost:8080/api';

function Newgame() {
  const [searchParams] = useSearchParams();
  const platformFromUrl = searchParams.get('platform') || 'all';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState(platformFromUrl);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleBuyClick = (game) => {
    alert(`เพิ่ม ${game.title} ลงในตะกร้าแล้ว\nราคา: ฿${game.price}`);
  };

  // Fetch games from backend API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        console.log('Fetching games from:', `${API_BASE_URL}/games`);
        
        const response = await fetch(`${API_BASE_URL}/games`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        
        const data = await response.json();
        console.log('Games fetched:', data.length, 'games');
        setAllGames(data);
        setFilteredGames(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('ไม่สามารถโหลดข้อมูลเกมได้ กรุณาลองใหม่อีกครั้ง');
        setAllGames([]);
        setFilteredGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Get unique categories and platforms from games
  const categories = useMemo(() => {
    const uniqueCategories = ['all', ...new Set(allGames.map(game => game.category))];
    return uniqueCategories;
  }, [allGames]);

  const platforms = useMemo(() => {
    // Fixed platforms matching Home page buttons
    return ['all', 'Steam', 'EA app', 'Ubisoft', 'Xbox', 'Microsoft Store'];
  }, []);

  // Filter games based on search query, category, and platform
  useEffect(() => {
    if (!allGames || allGames.length === 0) {
      setFilteredGames([]);
      return;
    }

    let filtered = [...allGames];

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
      filtered = filtered.filter(game => 
        game.platforms && game.platforms.some(p => p.includes(selectedPlatform))
      );
    }

    setFilteredGames(filtered);
  }, [searchQuery, selectedCategory, selectedPlatform, allGames]);

  // Update platform filter when URL parameter changes
  useEffect(() => {
    const platformParam = searchParams.get('platform');
    if (platformParam && platformParam !== 'all') {
      setSelectedPlatform(platformParam);
    }
  }, [searchParams]);

  return (
    <div className="newgame-container">
      <div className="search-section">
        <h1>เกมทั้งหมด</h1>
        <p>ค้นพบเกมใหม่ที่น่าตื่นเต้นและพร้อมให้คุณได้สัมผัสประสบการณ์</p>
        
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
          {loading ? (
            <div className="loading-container">
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
            </div>
          ) : (
            <div className="roblox-grid">
              {filteredGames.length > 0 ? (
                filteredGames.map(game => (
                  <div key={game.id} className="roblox-card">
                    <div 
                      className="roblox-image" 
                      style={{backgroundImage: `url(${game.image_url || '/assets/GameIcon.jpg'})`}}
                    ></div>
                    <div className="roblox-info">
                      <div className="roblox-title">{game.title}</div>
                      <div className="price-button-container">
                        <div className="roblox-price">฿{game.price}</div>
                        <button className="buy-btn" onClick={() => handleBuyClick(game)}>ซื้อเลย</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <i className="fas fa-search fa-3x mb-4"></i>
                  <p>ไม่พบเกมที่คุณค้นหา</p>
                </div>
              )}
            </div>
          )}
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

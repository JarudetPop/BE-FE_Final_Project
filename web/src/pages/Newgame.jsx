import React, { useState, useEffect } from 'react';
import fm26Image from '../assets/games/fm26.jpg';
import bdl4Image from '../assets/games/bdl4.jpg';
import lsaImage from '../assets/games/lsa.jpg';
import metalImage from '../assets/games/metal.jpg';

import '../App.css';
import '../styles/newgame.css';

function Newgame() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  
  const handleBuyClick = (game) => {
    alert(`เพิ่ม ${game.title} ลงในตะกร้าแล้ว\nราคา: ${game.price}`);
  };

  // Sample game data
  const allGames = [
    {
      id: 1,
      title: 'Football Manager 2026',
      image: fm26Image,
      price: '1,990฿',
      category: 'Sports',
      releaseDate: '2025-11-01',
      platforms: ['Steam', 'Epic Games']
    },
    {
      id: 2,
      title: 'Baldurs Gate 4',
      image: bdl4Image,
      price: '2,290฿',
      category: 'RPG',
      releaseDate: '2025-09-15',
      platforms: ['Steam', 'GOG']
    },
    {
      id: 3,
      title: 'Like a Snake Alive',
      image: lsaImage,
      price: '1,790฿',
      category: 'Action',
      releaseDate: '2025-10-05',
      platforms: ['Steam', 'PS Store']
    },
    {
      id: 4,
      title: 'Metal Saga',
      image: metalImage,
      price: '1,490฿',
      category: 'Action',
      releaseDate: '2025-08-20',
      platforms: ['Steam', 'Epic Games', 'GOG']
    }
  ];

  const categories = ['all', 'Action', 'RPG', 'Sports'];
  const platforms = ['all', 'Steam', 'Epic Games', 'GOG', 'PS Store'];

  // Filter games based on search query, category, and platform
  useEffect(() => {
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
      filtered = filtered.filter(game => game.platforms.includes(selectedPlatform));
    }

    setFilteredGames(filtered);
  }, [searchQuery, selectedCategory, selectedPlatform]);

  const handlePlatformClick = (platform, gameTitle) => {
    alert(`คุณกำลังจะเปิด ${platform} เพื่อดาวน์โหลด ${gameTitle}`);
  };

  return (
    <div className="newgame-container">
      <div className="search-section">
        <h1>เกมใหม่ล่าสุด</h1>
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

      <div className="games-grid">
        {filteredGames.length > 0 ? (
          filteredGames.map(game => (
            <div key={game.id} className="game-card">
              <img 
                src={game.image} 
                alt={game.title} 
                className="game-image"
              />
              <div className="game-info">
                <h3 className="game-title">{game.title}</h3>
                <p className="game-category">
                  {game.category} • วางจำหน่าย {new Date(game.releaseDate).toLocaleDateString('th-TH')}
                </p>
                <p className="game-price">{game.price}</p>
                <div className="platform-buttons">
                  {game.platforms.map(platform => (
                    <button
                      key={platform}
                      onClick={() => handlePlatformClick(platform, game.title)}
                      className={`platform-button ${platform.toLowerCase().split(' ')[0]}`}
                    >
                      <i className={`fab fa-${platform.toLowerCase().split(' ')[0]}`}></i>
                      {platform}
                    </button>
                  ))}
                  <button
                    onClick={() => handleBuyClick(game)}
                    className="buy-button"
                  >
                    <i className="fas fa-shopping-cart"></i>
                    เพิ่มลงตะกร้า
                  </button>
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
    </div>
  );
}

export default Newgame;

import React, { useState, useEffect, useMemo } from 'react';
import fm26Image from '../assets/games/fm26.jpg';
import monsterImage from '../assets/games/monster.jpg';
import needfsImage from '../assets/games/needfs.jpg';
import sifuIamage from '../assets/games/sifu-cover.jpg';
import farcry6Image from '../assets/games/far-cry-6-cover.jpg';
import fifa24Image from '../assets/games/ea-sports-fc-24-cover.jpg';
import bf1Image from '../assets/games/battlefield-1-cover.jpg';
import assasinImabe from '../assets/games/assassins-creed-valhalla-cover.jpg';
import watchdogsImage from '../assets/games/watch-dogs-legion-cover.jpg';
import bdl4Image from '../assets/games/bdl4.jpg';
import lsaImage from '../assets/games/lsa.jpg';
import metalImage from '../assets/games/metal.jpg';
import walLeftImage from '../assets/wal-left.jpg';
import walRightImage from '../assets/wal-right.jpg';

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

  // Sample game data - wrapped in useMemo to prevent recreation on every render
  const allGames = useMemo(() => [
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
      platforms: ['Steam']
    },
    {
      id: 3,
      title: 'Like a Snake Alive',
      image: lsaImage,
      price: '1,790฿',
      category: 'Action',
      releaseDate: '2025-10-05',
      platforms: ['Steam']
    },
    {
      id: 4,
      title: 'Metal Saga',
      image: metalImage,
      price: '1,490฿',
      category: 'Action',
      releaseDate: '2025-08-20',
      platforms: ['Steam', 'Epic Games']
    },
    {
      id: 5,
      title: 'Monster Hunter Wilds',
      image: monsterImage,
      price: '1,890฿',
      category: 'RPG',
      releaseDate: '2025-12-15',
      platforms: ['Steam', 'Epic Games']
    },
    {
      id: 6,
      title: 'Need for Speed Heat',
      image: needfsImage,
      price: '1,899฿',
      category: 'Sports',
      releaseDate: '2025-11-20',
      platforms: ['EA']
    },
    {
      id: 7,
      title: 'Far Cry 6',
      image: farcry6Image,
      price: '1,599฿',
      category: 'Action',
      releaseDate: '2025-10-30',
      platforms: ['Ubisoft']
    },
    {
      id: 8,
      title: 'Sifu',
      image: sifuIamage,
      price: '539฿',
      category: 'Action',
      releaseDate: '2025-09-25',
      platforms: ['Epic Games']
    },
    {
      id: 9,
      title: 'Battlefield 1',
      image: bf1Image,
      price: '599฿',
      category: 'FPS',
      releaseDate: '2025-11-10',
      platforms: ['EA']
    },
    {
      id: 10,
      title: 'EA SPORTS FC 24',
      image: fifa24Image,
      price: '1,899฿',
      category: 'Sports',
      releaseDate: '2025-12-01',
      platforms: ['EA']
    },
    {
      id: 11,
      title: 'Assassins Creed Valhalla',
      image: assasinImabe,
      price: '1,599฿',
      category: 'Action',
      releaseDate: '2025-09-05',
      platforms: ['XBOX', 'Ubisoft']
    },
    {
      id: 12,
      title: 'Watch Dogs Legion',
      image: watchdogsImage,
      price: '1,590฿',
      category: 'Action',
      releaseDate: '2025-10-15',
      platforms: ['XBOX', 'Ubisoft']
    }
  ], []);

  const categories = ['all', 'Action', 'RPG', 'Sports', 'FPS'];
  const platforms = ['all', 'Steam', 'Epic Games', 'EA', 'XBOX', 'Ubisoft'];

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
  }, [searchQuery, selectedCategory, selectedPlatform, allGames]);

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
          <div className="roblox-grid">
          {filteredGames.length > 0 ? (
            filteredGames.map(game => (
              <div key={game.id} className="roblox-card">
                <div 
                  className="roblox-image" 
                  style={{backgroundImage: `url(${game.image})`}}
                ></div>
                <div className="roblox-info">
                  <div className="roblox-title">{game.title}</div>
                  <div className="price-button-container">
                    <div className="roblox-price">฿{game.price.replace('฿', '').replace(',', '')}</div>
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

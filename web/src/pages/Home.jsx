import React, { useState, useEffect } from 'react';
import GTA6Image from '../assets/GTA6.jpg';
import MGSImage from '../assets/MGS.jpg';
import REDMImage from '../assets/REDM.jpg';
import fm26Image from '../assets/games/fm26.jpg';
import bdl4Image from '../assets/games/bdl4.jpg';
import lsaImage from '../assets/games/lsa.jpg';
import metalImage from '../assets/games/metal.jpg';
import Navbar from '../components/navbar';

import '../App.css';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if user is already logged in from localStorage
    const username = localStorage.getItem('username');
    return !!username;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Sample images for the carousel
  const slides = [
    { 
      url: GTA6Image, 
      title: 'Grand Theft Auto VI',
      description: 'The next generation of the legendary game series'
    },
    { 
      url: MGSImage, 
      title: 'Metal Gear Solid',
      description: 'Classic stealth action game'
    },
    { 
      url: REDMImage, 
      title: 'Red Dead Redemption',
      description: 'Wild West adventure'
    }
  ];
  
  // Check login status when component mounts
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedIsAdmin = localStorage.getItem('isAdmin');
    
    if (savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    }
  }, []);

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePlatformClick = (platform) => {
    alert(`คุณกำลังจะเปิด ${platform} เพื่อดาวน์โหลดเกม`);
  };

  const handleSearch = () => {
    const searchTerm = document.querySelector('.search-bar input').value;
    if (searchTerm) {
      alert(`ค้นหา: ${searchTerm}`);
    }
  };

  const handleNavClick = (section) => {
    alert(`คุณกำลังจะไปยังหน้า: ${section}`);
  };

  const handleRobloxClick = (gameTitle) => {
    alert(`คุณกำลังจะเปิดเกม: ${gameTitle}`);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const formUsername = e.target.elements[0].value;
    const formPassword = e.target.elements[1].value;
    
    if (formUsername === 'Admin' && formPassword === 'Admin123') {
      setIsLoggedIn(true);
      setUsername('Admin');
      localStorage.setItem('username', 'Admin');
      localStorage.setItem('isAdmin', 'true');
      setShowLoginModal(false);
      // เพิ่มการหน่วงเวลาเล็กน้อยก่อน redirect
      setTimeout(() => {
        window.location.href = '/backoffice';
      }, 100);
    } else {
      setIsLoggedIn(true);
      setUsername('ผู้ใช้');
      localStorage.setItem('username', 'ผู้ใช้');
      localStorage.setItem('isAdmin', 'false');
      setShowLoginModal(false);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // In a real app, you would create a new user here
    setIsLoggedIn(true);
    setUsername('ผู้ใช้ใหม่');
    setShowSignupModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    // Dispatch logout event
    window.dispatchEvent(new Event('logout'));
    // Redirect to home if on backoffice page
    if (window.location.pathname === '/backoffice') {
      window.location.href = '/';
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <img src="/logoWEB.png" alt="Logo" className="logo-icon" />
          <span className="logo-text">i HAVE GAMES.com</span>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="ค้นหาเกม..." />
          <button onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="auth-buttons">
          {isLoggedIn ? (
            <div className="user-menu">
              <span className="welcome-text">สวัสดี, {username}</span>
              <button className="logout-btn" onClick={handleLogout}>ออกจากระบบ</button>
            </div>
          ) : (
            <>
              <button className="login-btn" onClick={() => setShowLoginModal(true)}>เข้าสู่ระบบ</button>
              <button className="signup-btn" onClick={() => setShowSignupModal(true)}>สมัครสมาชิก</button>
            </>
          )}
        </div>
      </header>

      <main className="main-content">
        <section className="game-showcase">
          <div className="game-image">
            <div className="carousel">
              <div className="carousel-inner">
                {slides.map((slide, index) => (
                  <div 
                    key={index} 
                    className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
                    style={{backgroundImage: `url(${slide.url})`}}
                  >
                    <div className="carousel-caption">
                      <h3>{slide.title}</h3>
                      <p>{slide.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Carousel controls */}
              <button 
                className="carousel-control prev" 
                onClick={() => setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
              >
              </button>
              <button 
                className="carousel-control next" 
                onClick={() => setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)}
              >
                &#10095;
              </button>
              
              {/* Carousel indicators */}
              <div className="carousel-indicators">
                {slides.map((_, index) => (
                  <span
                    key={index}
                    className={`indicator ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  ></span>
                ))}
              </div>
            </div>
          </div>
          <div className="platform-buttons">
            <button className="platform-btn steam" onClick={() => handlePlatformClick('Steam')}>
              <i className="fab fa-steam"></i> Steam
            </button>
            <button className="platform-btn ea-app" onClick={() => handlePlatformClick('EA app')}>
              <i className="fas fa-gamepad"></i> EA app
            </button>
            <button className="platform-btn ubisoft" onClick={() => handlePlatformClick('Ubisoft')}>
              <i className="fas fa-cube"></i> Ubisoft
            </button>
          </div>
        </section>
        
        
        <section className="roblox-section">
          <div className="section-header">
            <h2 className="section-title">ออกใหม่</h2>
            <button className="view-all-btn" onClick={() => window.location.href = '/newgame'}>ดูทั้งหมด</button>
          </div>
          <div className="roblox-grid">
            <div className="roblox-card">
              <div className="roblox-image" style={{backgroundImage: `url(${fm26Image})`}}></div>
              <div className="roblox-info">
                <div className="roblox-title">Football Manager 2026</div>
                <div className="price-button-container">
                  <div className="roblox-price">฿1599</div>
                  <button className="buy-btn" onClick={() => handleRobloxClick('Football Manager 2026')}>ซื้อเลย</button>
                </div>
              </div>
            </div>
            <div className="roblox-card">
              <div className="roblox-image" style={{backgroundImage: `url(${bdl4Image})`}}></div>
              <div className="roblox-info">
                <div className="roblox-title">Borderlands 4</div>
                <div className="price-button-container">
                  <div className="roblox-price">฿1890</div>
                  <button className="buy-btn" onClick={() => handleRobloxClick('Borderlands 4')}>ซื้อเลย</button>
                </div>
              </div>
            </div>
            <div className="roblox-card">
              <div className="roblox-image" style={{backgroundImage: `url(${lsaImage})`}}></div>
              <div className="roblox-info">
                <div className="roblox-title">Lost Soul Aside</div>
                <div className="price-button-container">
                  <div className="roblox-price">฿1899</div>
                  <button className="buy-btn" onClick={() => handleRobloxClick('Lost Soul Aside')}>ซื้อเลย</button>
                </div>
              </div>
            </div>
            <div className="roblox-card">
              <div className="roblox-image" style={{backgroundImage: `url(${metalImage})`}}></div>
              <div className="roblox-info">
                <div className="roblox-title">Metal Gear Solid Δ: Snake Eater</div>
                <div className="price-button-container">
                  <div className="roblox-price">฿1899</div>
                  <button className="buy-btn" onClick={() => handleRobloxClick('Metal Gear Solid Δ: Snake Eater')}>ซื้อเลย</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <p>&copy; Copyright © 2025 i HAVE GAME. All Rights Reserved. For educational purposes in Backend - Frontend only.</p>
      </footer>
      
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>เข้าสู่ระบบ</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>ชื่อผู้ใช้:</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>รหัสผ่าน:</label>
                <input type="password" required />
              </div>
              <div className="form-actions">
                <button type="submit">เข้าสู่ระบบ</button>
                <button type="button" onClick={() => setShowLoginModal(false)}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showSignupModal && (
        <div className="modal-overlay" onClick={() => setShowSignupModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>สมัครสมาชิก</h2>
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label>ชื่อผู้ใช้:</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>อีเมล:</label>
                <input type="email" required />
              </div>
              <div className="form-group">
                <label>รหัสผ่าน:</label>
                <input type="password" required />
              </div>
              <div className="form-group">
                <label>ยืนยันรหัสผ่าน:</label>
                <input type="password" required />
              </div>
              <div className="form-actions">
                <button type="submit">สมัครสมาชิก</button>
                <button type="button" onClick={() => setShowSignupModal(false)}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
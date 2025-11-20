import React, { useState, useEffect } from 'react';
import GTA6Image from '../assets/GTA6.jpg';
import MGSImage from '../assets/MGS.jpg';
import REDMImage from '../assets/REDM.jpg';
import fm26Image from '../assets/games/fm26.jpg';
import bdl4Image from '../assets/games/bdl4.jpg';
import lsaImage from '../assets/games/lsa.jpg';
import metalImage from '../assets/games/metal.jpg';
import walRightImage from '../assets/wal-right.jpg';
import walLeftImage from '../assets/wal-left.jpg';

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

  const handleRobloxClick = (gameTitle) => {
    alert(`คุณกำลังจะเปิดเกม: ${gameTitle}`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formUsername = e.target.elements[0].value;
    const formPassword = e.target.elements[1].value;
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formUsername,
          password: formPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUsername(data.username);
        localStorage.setItem('username', data.username);
        localStorage.setItem('isAdmin', data.is_admin.toString());
        localStorage.setItem('userId', data.id.toString());
        setShowLoginModal(false);
        
        // Redirect to backoffice if admin
        if (data.is_admin) {
          setTimeout(() => {
            window.location.href = '/backoffice';
          }, 100);
        }
      } else {
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('ข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const formUsername = e.target.elements[0].value;
    const formEmail = e.target.elements[1].value;
    const formPassword = e.target.elements[2].value;
    const formConfirmPassword = e.target.elements[3].value;

    if (formPassword !== formConfirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formUsername,
          email: formEmail,
          password: formPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUsername(data.username);
        localStorage.setItem('username', data.username);
        localStorage.setItem('isAdmin', 'false');
        localStorage.setItem('userId', data.id.toString());
        setShowSignupModal(false);
        alert('สมัครสมาชิกสำเร็จ');
      } else if (response.status === 409) {
        alert('ชื่อผู้ใช้นี้มีอยู่แล้ว');
      } else {
        alert('ข้อผิดพลาดในการสมัครสมาชิก');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('ข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่');
    }
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
            <button className="platform-btn xbox" onClick={() => handlePlatformClick('Xbox')}>
              <i className="fab fa-xbox"></i> Xbox
            </button>
            <button className="platform-btn microsoft" onClick={() => handlePlatformClick('Microsoft Store')}>
              <i className="fab fa-windows"></i> Microsoft Store
            </button>
          </div>
        </section>
        
        
        <div className="section-with-sidebar">
          <aside className="section-sidebar">
            <div className="side-banner tall">
              <img src={walLeftImage} alt="Banner" />
            </div>
          </aside>

          <div className="combined-sections">
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

        <section className="roblox-section">
          <div className="section-header">
            <h2 className="section-title">ยอดนิยม</h2>
            <button className="view-all-btn" onClick={() => window.location.href = '/newgame'}>ดูทั้งหมด</button>
          </div>
          <div className="roblox-grid">
            <div className="roblox-card">
              <div className="roblox-image" style={{backgroundImage: `url(${GTA6Image})`}}></div>
              <div className="roblox-info">
                <div className="roblox-title">Grand Theft Auto VI</div>
                <div className="price-button-container">
                  <div className="roblox-price">฿2590</div>
                  <button className="buy-btn" onClick={() => handleRobloxClick('Grand Theft Auto VI')}>ซื้อเลย</button>
                </div>
              </div>
            </div>
            <div className="roblox-card">
              <div className="roblox-image" style={{backgroundImage: `url(${MGSImage})`}}></div>
              <div className="roblox-info">
                <div className="roblox-title">Metal Gear Solid</div>
                <div className="price-button-container">
                  <div className="roblox-price">฿1790</div>
                  <button className="buy-btn" onClick={() => handleRobloxClick('Metal Gear Solid')}>ซื้อเลย</button>
                </div>
              </div>
            </div>
            <div className="roblox-card">
              <div className="roblox-image" style={{backgroundImage: `url(${REDMImage})`}}></div>
              <div className="roblox-info">
                <div className="roblox-title">Red Dead Redemption</div>
                <div className="price-button-container">
                  <div className="roblox-price">฿1990</div>
                  <button className="buy-btn" onClick={() => handleRobloxClick('Red Dead Redemption')}>ซื้อเลย</button>
                </div>
              </div>
            </div>
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
          </div>
        </section>
      </div>

      <aside className="section-sidebar">
        <div className="side-banner tall">
          <img src={walRightImage} alt="Banner" />
        </div>
      </aside>
    </div>

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
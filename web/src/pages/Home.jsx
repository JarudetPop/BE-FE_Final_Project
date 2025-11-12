import React, { useState, useEffect } from 'react';
import '../App.css';
import GTA6Image from '../assets/GTA6.jpg';
import MGSImage from '../assets/MGS.jpg';
import REDMImage from '../assets/REDM.jpg';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const username = localStorage.getItem('username');
    return !!username;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [gameList, setGameList] = useState([]); // ใช้สำหรับแสดงเกมทั้งหมดเท่านั้น
  const [slides, setSlides] = useState([]); // ✅ slides สำหรับ carousel (ดึงจาก API)
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 8;

  // ✅ ดึงข้อมูลเกมจาก Backend
  useEffect(() => {
    fetch('http://localhost:8080/api/games')
      .then(res => res.json())
      .then(data => {
        setGameList(data);

        // 🔥 ดึงมาแค่ 5-7 เกมจาก API สำหรับสไลด์
        const randomSlides = data.sort(() => 0.5 - Math.random()).slice(0, 7).map(game => ({
          url: game.image_url || "https://via.placeholder.com/1200x500?text=No+Image",
          title: game.title,
          description: game.description || "เกมสุดมันส์ ห้ามพลาด!"
        }));

        // ถ้า API ว่าง — fallback เป็นภาพใน assets เดิม
        if (randomSlides.length > 0) {
          setSlides(randomSlides);
        } else {
          setSlides([
            { url: GTA6Image, title: 'Grand Theft Auto VI', description: 'The next generation of the legendary game series' },
            { url: MGSImage, title: 'Metal Gear Solid', description: 'Classic stealth action game' },
            { url: REDMImage, title: 'Red Dead Redemption', description: 'Wild West adventure' }
          ]);
        }
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        // ถ้า fetch พัง ให้ fallback เป็นภาพเดิม
        setSlides([
          { url: GTA6Image, title: 'Grand Theft Auto VI', description: 'The next generation of the legendary game series' },
          { url: MGSImage, title: 'Metal Gear Solid', description: 'Classic stealth action game' },
          { url: REDMImage, title: 'Red Dead Redemption', description: 'Wild West adventure' }
        ]);
      });
  }, []);

  // ✅ Auto Slide
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  // ✅ Login Logic
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
      setTimeout(() => window.location.href = '/backoffice', 100);
    } else {
      setIsLoggedIn(true);
      setUsername(formUsername || 'ผู้ใช้');
      localStorage.setItem('username', formUsername || 'ผู้ใช้');
      localStorage.setItem('isAdmin', 'false');
      setShowLoginModal(false);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setUsername('ผู้ใช้ใหม่');
    localStorage.setItem('username', 'ผู้ใช้ใหม่');
    setShowSignupModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    window.dispatchEvent(new Event('logout'));

    if (window.location.pathname === '/backoffice') {
      window.location.href = '/';
    }
  };

  // ✅ Pagination (ส่วนนี้ไม่แตะ)
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = gameList.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(gameList.length / gamesPerPage);

  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <img src="/logoWEB.png" alt="Logo" className="logo-icon" />
          <span className="logo-text">i HAVE GAMES.com</span>
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
    <div className="carousel">
      <div className="carousel-inner">
        {gameList.length > 0 ? (
          gameList.slice(0, 7).map((game, index) => (
            <div
              key={index}
              className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${game.image_url || "https://via.placeholder.com/1920x600?text=No+Image"})`,
              }}
            >
              <div className="carousel-caption">
                <h3>{game.title}</h3>
                <p>{game.description || 'เกมสุดมันส์ ห้ามพลาด!'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="carousel-item active" style={{ backgroundColor: '#333' }}>
            <div className="carousel-caption">
              <h3>กำลังโหลด...</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  </section>

        {/* ✅ ส่วนรายชื่อเกมทั้งหมด — ไม่แตะเลย */}
        <section className="roblox-section">
          <div className="section-header">
            <h2 className="section-title">เกมทั้งหมด</h2>
          </div>

          <div className="roblox-grid">
            {gameList.length === 0 ? (
              <p>กำลังโหลดข้อมูล...</p>
            ) : (
              currentGames.map((game) => (
                <div className="roblox-card" key={game.game_id}>
                  <div className="roblox-image-container">
                    <img
                      src={game.image_url || "https://via.placeholder.com/300x400?text=No+Image"}
                      alt={game.title}
                      className="roblox-image"
                    />
                  </div>
                  <div className="roblox-info">
                    <div className="roblox-title">{game.title}</div>
                    <div className="roblox-price">฿{game.price}</div>
                    <div className="platforms">
                      <small>{Array.isArray(game.platforms) ? game.platforms.join(", ") : game.platforms}</small>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pagination">
            <button onClick={goToPrevPage} disabled={currentPage === 1}>ย้อนกลับ</button>
            <span>หน้า {currentPage} จาก {totalPages}</span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>ถัดไป</button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 i HAVE GAME. All Rights Reserved.</p>
      </footer>

      {/* LOGIN MODAL */}
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

      {/* SIGNUP MODAL */}
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

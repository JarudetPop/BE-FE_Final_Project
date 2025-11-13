import React from 'react';
import '../styles/helpsupport.css';

function HelpSupport() {
  return (
    <div className="help-support-container">
      <div className="contact-header">
        <h1>ติดต่อเรา</h1>
        <p>หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อเราได้ที่</p>
      </div>

      <div className="contact-content">
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <h3>แบบฟอร์มติดต่อ</h3>
            <a href="https://www.gamesrig.com/contact-us" target="_blank" rel="noopener noreferrer">
              www.ihavegames.com/contact-us
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <i className="fas fa-at"></i>
            </div>
            <h3>อีเมล</h3>
            <a href="mailto:support@ihavegames.com">
              support@ihavegames.com
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <i className="fab fa-facebook"></i>
            </div>
            <h3>Facebook Fanpage</h3>
            <a href="https://www.facebook.com/messages/t/Gamesrig/" target="_blank" rel="noopener noreferrer">
              iHAVEGAMES
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <i className="fab fa-line"></i>
            </div>
            <h3>LINE ID</h3>
            <p>ihavegames</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <i className="fab fa-instagram"></i>
            </div>
            <h3>Instagram</h3>
            <a href="https://www.instagram.com/gamesrig/" target="_blank" rel="noopener noreferrer">
              @ihavegames
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <i className="fas fa-phone"></i>
            </div>
            <h3>เบอร์โทรศัพท์</h3>
            <a href="tel:095-918-4267">
              095-918-4267
            </a>
          </div>

          <div className="contact-card hours-card">
            <div className="contact-icon">
              <i className="fas fa-clock"></i>
            </div>
            <h3>เวลาทำการ</h3>
            <p>ฝ่ายบริการลูกค้าจะคอยให้บริการทุกวัน</p>
            <p className="hours-time">9:00 – 23:59 น.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpSupport;

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/notfound.css';

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-heading">404</h1>
        <p className="not-found-title">
          ไม่พบหน้าที่คุณค้นหา
        </p>
        <p className="not-found-message">
          ดูเหมือนว่าหน้าที่คุณพยายามเข้าถึงไม่มีอยู่ 
          อาจจะถูกย้ายหรือลบไปแล้ว
        </p>
        <div className="button-container">
          <Link to="/" className="primary-button">
            <svg
              className="button-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            กลับหน้าแรก
          </Link>
          <Link to="/newgame" className="secondary-button">
            <svg
              className="button-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
              />
            </svg>
            ดูเกมใหม่
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
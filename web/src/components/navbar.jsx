import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">หน้าแรก</Link>
        </li>
        <li className={location.pathname === '/newgame' ? 'active' : ''}>
          <Link to="/newgame">เกมใหม่</Link>
        </li>
        <li className={location.pathname === '/popular' ? 'active' : ''}>
          <Link to="/popular">เกมยอดนิยม</Link>
        </li>
        <li className={location.pathname === '/promotion' ? 'active' : ''}>
          <Link to="/promotion">โปรโมชั่น</Link>
        </li>
        <li className={location.pathname === '/free' ? 'active' : ''}>
          <Link to="/free">เกมฟรี</Link>
        </li>
        <li className={location.pathname === '/contact' ? 'active' : ''}>
          <Link to="/contact">ติดต่อเรา</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
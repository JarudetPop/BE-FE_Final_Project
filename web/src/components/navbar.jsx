import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check admin status when component mounts and when localStorage changes
    const checkAdminStatus = () => {
      const username = localStorage.getItem('username');
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(username === 'Admin' && adminStatus);
    };

    // Initial check
    checkAdminStatus();

    // Listen for storage changes (in case of logout)
    window.addEventListener('storage', checkAdminStatus);
    
    // Add custom event listener for logout
    const handleLogout = () => {
      setIsAdmin(false);
    };
    window.addEventListener('logout', handleLogout);
    
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

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
        {isAdmin && (
          <li className={location.pathname === '/backoffice' ? 'active' : ''}>
            <Link to="/backoffice">แผงควบคุม</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
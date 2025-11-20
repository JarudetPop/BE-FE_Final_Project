import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/backoffice.css';

// API base URL
const API_BASE_URL = 'http://localhost:8080/api';

function BackOffice() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if user is admin on component mount and when localStorage changes
  useEffect(() => {
    const checkAdminAccess = () => {
      const username = localStorage.getItem('username');
      const isAdminUser = localStorage.getItem('isAdmin') === 'true';
      
      if (!username || !isAdminUser) {
        navigate('/');
      } else {
        setIsAdmin(true);
      }
    };

    // Initial check
    checkAdminAccess();

    // Listen for storage changes
    window.addEventListener('storage', checkAdminAccess);
    
    return () => {
      window.removeEventListener('storage', checkAdminAccess);
    };
  }, [navigate]);

  // initial sample data
  // Predefined categories and platforms for selection
  const categories = [
    'แอคชั่น',
    'ผจญภัย',
    'กีฬา',
    'ยิง FPS',
    'แข่งรถ',
    'เล่นตามบทบาท RPG',
    'วางแผนกลยุทธ์'
  ];

  const platforms = [
    'PC (Steam)',
    'PC (Epic)',
    'PlayStation 5',
    'Xbox Series X|S',
    'Nintendo Switch'
  ];

  const [games, setGames] = useState([]);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    title: '', 
    price: '', 
    category: categories[0],
    platforms: [],
    releaseDate: '',
    imageUrl: '/assets/games/GameIcon.jpg'
  });

  // Fetch games from backend
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
      setGames(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('ไม่สามารถโหลดข้อมูลเกมได้');
    } finally {
      setLoading(false);
    }
  };

  // Load games on component mount
  useEffect(() => {
    if (isAdmin) {
      fetchGames();
    }
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'platforms') {
      const platform = value;
      setForm(prev => ({
        ...prev,
        platforms: checked 
          ? [...prev.platforms, platform]
          : prev.platforms.filter(p => p !== platform)
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAdd = async () => {
    if (!form.title || !form.price || !form.category || form.platforms.length === 0 || !form.releaseDate) {
      return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }

    try {
      setLoading(true);
      const userId = 1; // Default admin user ID
      
      const gameData = {
        title: form.title,
        price: Number(form.price),
        category: form.category,
        platforms: form.platforms,
        release_date: form.releaseDate,
        image_url: form.imageUrl || '/assets/games/GameIcon.jpg',
        created_by: userId
      };

      const response = await fetch(`${API_BASE_URL}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      await fetchGames(); // Refresh the list
      
      // Reset form
      setForm({ 
        title: '', 
        price: '', 
        category: categories[0], 
        platforms: [],
        releaseDate: '',
        imageUrl: '/assets/games/GameIcon.jpg'
      });
      
      alert('เพิ่มเกมสำเร็จ!');
    } catch (err) {
      console.error('Error creating game:', err);
      alert('ไม่สามารถเพิ่มเกมได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (game) => {
    setEditing(game.id);
    setForm({ 
      title: game.title, 
      price: String(game.price),
      category: game.category,
      platforms: Array.isArray(game.platforms) ? [...game.platforms] : [],
      releaseDate: game.release_date ? game.release_date.split('T')[0] : '',
      imageUrl: game.image_url || '/assets/games/GameIcon.jpg'
    });
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.category || form.platforms.length === 0 || !form.releaseDate) {
      return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }

    try {
      setLoading(true);
      
      const gameData = {
        title: form.title,
        price: Number(form.price),
        category: form.category,
        platforms: form.platforms,
        release_date: form.releaseDate,
        image_url: form.imageUrl || '/assets/games/GameIcon.jpg',
        created_by: 1
      };

      const response = await fetch(`${API_BASE_URL}/games/${editing}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error('Failed to update game');
      }

      await fetchGames(); // Refresh the list
      
      setEditing(null);
      setForm({ 
        title: '', 
        price: '', 
        category: categories[0], 
        platforms: [],
        releaseDate: '',
        imageUrl: '/assets/games/GameIcon.jpg'
      });
      
      alert('แก้ไขเกมสำเร็จ!');
    } catch (err) {
      console.error('Error updating game:', err);
      alert('ไม่สามารถแก้ไขเกมได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันการลบเกมนี้?')) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/games/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete game');
      }

      await fetchGames(); // Refresh the list
      alert('ลบเกมสำเร็จ!');
    } catch (err) {
      console.error('Error deleting game:', err);
      alert('ไม่สามารถลบเกมได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ 
      title: '', 
      price: '', 
      category: categories[0], 
      platforms: [],
      releaseDate: '',
      imageUrl: '/assets/games/GameIcon.jpg'
    });
  };

  if (!isAdmin) {
    return null; // Don't render anything while checking authentication
  }

  return (
    <div className="backoffice-container">
      <header className="backoffice-header">
        <h1>แผงควบคุมผู้ดูแลระบบ</h1>
        <p>จัดการรายการเกม</p>
      </header>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <section className="backoffice-actions">
        <div className="form-grid">
          <div className="form-group">
            <label>ชื่อเกม:</label>
            <input
              type="text"
              name="title"
              placeholder="ชื่อเกม"
              value={form.title}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>ราคา (฿):</label>
            <input
              type="number"
              name="price"
              placeholder="ราคา"
              value={form.price}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>หมวดหมู่:</label>
            <select 
              name="category" 
              value={form.category}
              onChange={handleChange}
              disabled={loading}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>วันที่วางจำหน่าย:</label>
            <input
              type="date"
              name="releaseDate"
              value={form.releaseDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>URL รูปภาพ:</label>
            <input
              type="text"
              name="imageUrl"
              placeholder="/assets/games/GameIcon.jpg"
              value={form.imageUrl}
              onChange={handleChange}
              disabled={loading}
            />
            <small>ตัวอย่าง: /assets/games/fm26.jpg</small>
          </div>

          <div className="form-group platforms-group">
            <label>แพลตฟอร์มที่รองรับ:</label>
            <div className="platforms-grid">
              {platforms.map(platform => (
                <label key={platform} className="platform-checkbox">
                  <input
                    type="checkbox"
                    name="platforms"
                    value={platform}
                    checked={form.platforms.includes(platform)}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {platform}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            {editing ? (
              <>
                <button className="btn save" onClick={handleSave} disabled={loading}>
                  {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
                <button className="btn cancel" onClick={handleCancel} disabled={loading}>
                  ยกเลิก
                </button>
              </>
            ) : (
              <button className="btn add" onClick={handleAdd} disabled={loading}>
                {loading ? 'กำลังเพิ่ม...' : 'เพิ่มเกม'}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="backoffice-list">
        {loading && games.length === 0 ? (
          <div className="loading-message">กำลังโหลดข้อมูล...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ชื่อเกม</th>
                <th>หมวดหมู่</th>
                <th>ราคา (฿)</th>
                <th>แพลตฟอร์ม</th>
                <th>วันที่วางจำหน่าย</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {games.map(game => (
                <tr key={game.id}>
                  <td>{game.title}</td>
                  <td>{game.category}</td>
                  <td>{game.price}</td>
                  <td>{Array.isArray(game.platforms) ? game.platforms.join(', ') : ''}</td>
                  <td>{game.release_date ? new Date(game.release_date).toLocaleDateString('th-TH') : '-'}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn edit" 
                      onClick={() => handleEdit(game)}
                      disabled={loading}
                    >
                      แก้ไข
                    </button>
                    <button 
                      className="btn delete" 
                      onClick={() => handleDelete(game.id)}
                      disabled={loading}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default BackOffice;
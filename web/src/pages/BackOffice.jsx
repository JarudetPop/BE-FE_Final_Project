import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/backoffice.css';

const API_BASE_URL = 'http://localhost:8080/api';

function BackOffice() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Check if user is admin on component mount and when localStorage changes
  useEffect(() => {
    const checkAdminAccess = () => {
      const username = localStorage.getItem('username');
      const isAdminUser = localStorage.getItem('isAdmin') === 'true';
      
      if (!username || !isAdminUser) {
        navigate('/');
      } else {
        setIsAdmin(true);
        fetchGames();
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
    image_url: '',
    imagePreview: null
  });

  // Fetch games from API
  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/games`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setGames(data);
          setError('');
        }
      } else {
        setError('ไม่สามารถโหลดรายการเกมได้');
      }
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('ข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      
      // Upload image to backend
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setForm(prev => ({
          ...prev,
          image_url: data.image_url,
        }));
      } else {
        alert('ไม่สามารถอัปโหลดรูปภาพได้');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('ข้อผิดพลาดในการอัปโหลดรูปภาพ');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.title || !form.price || !form.category || form.platforms.length === 0 || !form.releaseDate) {
      return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${API_BASE_URL}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title,
          price: parseFloat(form.price),
          category: form.category,
          platforms: form.platforms,
          release_date: form.releaseDate,
          image_url: form.image_url || '',
          created_by: parseInt(userId),
        }),
      });

      if (response.ok) {
        alert('เพิ่มเกมสำเร็จ');
        await fetchGames();
        setForm({ 
          title: '', 
          price: '', 
          category: categories[0], 
          platforms: [],
          releaseDate: '',
          image_url: '',
          imagePreview: null
        });
      } else {
        alert('ไม่สามารถเพิ่มเกมได้');
      }
    } catch (err) {
      console.error('Error adding game:', err);
      alert('ข้อผิดพลาดในการเพิ่มเกม');
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
      platforms: Array.isArray(game.platforms) ? game.platforms : game.platforms.split(','),
      releaseDate: game.release_date,
      image_url: game.image_url || '',
      imagePreview: null
    });
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.category || form.platforms.length === 0 || !form.releaseDate) {
      return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/games/${editing}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title,
          price: parseFloat(form.price),
          category: form.category,
          platforms: form.platforms,
          release_date: form.releaseDate,
          image_url: form.image_url || '',
        }),
      });

      if (response.ok) {
        alert('แก้ไขเกมสำเร็จ');
        await fetchGames();
        setEditing(null);
        setForm({ 
          title: '', 
          price: '', 
          category: categories[0], 
          platforms: [],
          releaseDate: '',
          image_url: '',
          imagePreview: null
        });
      } else {
        alert('ไม่สามารถแก้ไขเกมได้');
      }
    } catch (err) {
      console.error('Error updating game:', err);
      alert('ข้อผิดพลาดในการแก้ไขเกม');
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

      if (response.ok) {
        alert('ลบเกมสำเร็จ');
        await fetchGames();
      } else {
        alert('ไม่สามารถลบเกมได้');
      }
    } catch (err) {
      console.error('Error deleting game:', err);
      alert('ข้อผิดพลาดในการลบเกม');
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
      image_url: '',
      imagePreview: null
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

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">กำลังโหลด...</div>}

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
            />
          </div>

          <div className="form-group">
            <label>หมวดหมู่:</label>
            <select 
              name="category" 
              value={form.category}
              onChange={handleChange}
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
            />
          </div>

          <div className="form-group image-upload-group">
            <label>รูปภาพเกม:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
            />
            {form.image_url && (
              <div className="image-info">
                ไฟล์: {form.image_url}
              </div>
            )}
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
                  />
                  {platform}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            {editing ? (
              <>
                <button className="btn save" onClick={handleSave} disabled={loading}>บันทึก</button>
                <button className="btn cancel" onClick={handleCancel} disabled={loading}>ยกเลิก</button>
              </>
            ) : (
              <button className="btn add" onClick={handleAdd} disabled={loading}>เพิ่มเกม</button>
            )}
          </div>
        </div>
      </section>

      <section className="backoffice-list">
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
                <td>{Array.isArray(game.platforms) ? game.platforms.join(', ') : game.platforms}</td>
                <td>{new Date(game.release_date).toLocaleDateString('th-TH')}</td>
                <td className="actions-cell">
                  <button className="btn edit" onClick={() => handleEdit(game)} disabled={loading}>
                    แก้ไข
                  </button>
                  <button className="btn delete" onClick={() => handleDelete(game.id)} disabled={loading}>
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default BackOffice;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/backoffice.css';

function BackOffice() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  
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

  const [games, setGames] = useState([
    { 
      id: 1, 
      title: 'Football Manager 2026', 
      price: 1599,
      category: 'กีฬา',
      platforms: ['PC (Steam)', 'PC (Epic)'],
      releaseDate: '2025-11-06'
    },
    { 
      id: 2, 
      title: 'Borderlands 4', 
      price: 1890,
      category: 'ยิง FPS',
      platforms: ['PC (Steam)', 'PlayStation 5', 'Xbox Series X|S'],
      releaseDate: '2025-12-25'
    },
    { 
      id: 3, 
      title: 'Lost Soul Aside', 
      price: 1899,
      category: 'แอคชั่น',
      platforms: ['PlayStation 5', 'PC (Epic)'],
      releaseDate: '2026-01-15'
    },
  ]);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    title: '', 
    price: '', 
    category: categories[0],
    platforms: [],
    releaseDate: '',
    image: null,
    imagePreview: null
  });

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
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!form.title || !form.price || !form.category || form.platforms.length === 0 || !form.releaseDate) {
      return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
    const newGame = { 
      id: Date.now(), 
      title: form.title, 
      price: Number(form.price),
      category: form.category,
      platforms: [...form.platforms],
      releaseDate: form.releaseDate,
      image: form.imagePreview || null
    };
    setGames(prev => [newGame, ...prev]);
    setForm({ 
      title: '', 
      price: '', 
      category: categories[0], 
      platforms: [],
      releaseDate: '',
      image: null,
      imagePreview: null
    });
  };

  const handleEdit = (game) => {
    setEditing(game.id);
    setForm({ 
      title: game.title, 
      price: String(game.price),
      category: game.category,
      platforms: [...game.platforms],
      releaseDate: game.releaseDate,
      image: null,
      imagePreview: game.image || null
    });
  };

  const handleSave = () => {
    if (!form.title || !form.price || !form.category || form.platforms.length === 0 || !form.releaseDate) {
      return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
    setGames(games.map(item => 
      item.id === editing 
        ? { 
            ...item, 
            title: form.title, 
            price: Number(form.price),
            category: form.category,
            platforms: [...form.platforms],
            releaseDate: form.releaseDate,
            image: form.imagePreview || item.image
          }
        : item
    ));
    setEditing(null);
    setForm({ 
      title: '', 
      price: '', 
      category: categories[0], 
      platforms: [],
      releaseDate: '',
      image: null,
      imagePreview: null
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('ยืนยันการลบเกมนี้?')) return;
    setGames(games.filter(item => item.id !== id));
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ 
      title: '', 
      price: '', 
      category: categories[0], 
      platforms: [],
      releaseDate: '',
      image: null,
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
            {form.imagePreview && (
              <div className="image-preview">
                <img src={form.imagePreview} alt="Preview" />
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
                <button className="btn save" onClick={handleSave}>บันทึก</button>
                <button className="btn cancel" onClick={handleCancel}>ยกเลิก</button>
              </>
            ) : (
              <button className="btn add" onClick={handleAdd}>เพิ่มเกม</button>
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
                <td>{game.platforms.join(', ')}</td>
                <td>{new Date(game.releaseDate).toLocaleDateString('th-TH')}</td>
                <td className="actions-cell">
                  <button className="btn edit" onClick={() => handleEdit(game)}>
                    แก้ไข
                  </button>
                  <button className="btn delete" onClick={() => handleDelete(game.id)}>
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
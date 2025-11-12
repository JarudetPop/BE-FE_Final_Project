import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/backoffice.css';

const apiBase = "http://localhost:8080"; // ✅ ใช้ backend ที่คุณรันอยู่

function BackOffice() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
  title: '',
  price: '',
  category_name: '',
  platforms: [],
  release_date: '',
  image_url: '' 
  });


  const fetchSteamImage = async (title) => {
    const res = await fetch(`http://localhost:8080/api/steam/search?title=${encodeURIComponent(title)}`);
    const data = await res.json();
    return data.image_url || null;
  };


  // ✅ ตรวจสิทธิ์ admin
  useEffect(() => {
    const username = localStorage.getItem('username');
    const isAdminStatus = localStorage.getItem('isAdmin') === 'true';
    if (!username || !isAdminStatus) navigate('/');
    else setIsAdmin(true);
  }, [navigate]);

  // ✅ โหลดข้อมูล
useEffect(() => {
  fetch(`${apiBase}/api/games`)
    .then(res => res.json())
    .then(data => setGames(data));

  fetch(`${apiBase}/api/categories`)
    .then(res => res.json())
    .then(data => setCategories(data.map(c => c.category_name)));

  fetch(`${apiBase}/api/platforms`)
    .then(res => res.json())
    .then(data => setPlatforms(data.map(p => p.platform_name)));
}, []);


  // ✅ อัปเดตค่า input
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (name === 'platforms') {
      setForm(prev => ({
        ...prev,
        platforms: checked
          ? [...prev.platforms, value]
          : prev.platforms.filter(p => p !== value)
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // ✅ เพิ่มเกม
const handleAdd = async () => {
  if (!form.title || !form.price || !form.category_name || form.platforms.length === 0) {
    return alert("กรุณากรอกข้อมูลให้ครบ");
  }

  const res = await fetch(`${apiBase}/api/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: form.title,
      price: Number(form.price),
      category_name: form.category_name,
      platforms: form.platforms,
      release_date: form.release_date,
      image_url: form.image_url
    })

  });

  if (res.ok) {
    setGames(await (await fetch(`${apiBase}/api/games`)).json());
    resetForm();
  } else alert("เพิ่มเกมไม่สำเร็จ");
};


  // ✅ แก้ไขเกม
const handleEdit = (game) => {
    // 🚀 เพิ่มบรรทัดนี้: ตั้งค่า ID ของเกมที่กำลังแก้ไข
    setEditing(game.game_id); 
    
    setForm({
    title: game.title,
    price: game.price,
    category_name: game.category_name,
    platforms: game.platforms,
    release_date: game.release_date.split('T')[0],
    image_url: game.image_url || '' 
  });
};


  // ✅ บันทึกการแก้ไข
  const handleSave = async () => {
    const res = await fetch(`${apiBase}/api/games/${editing}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: form.title,
      price: Number(form.price),
      category_name: form.category_name,
      platforms: form.platforms,
      release_date: form.release_date,
      image_url: form.image_url   // ✅ ใส่ด้วย
    })


    });

    if (res.ok) {
      setGames(await (await fetch(`${apiBase}/api/games`)).json());
      resetForm();
    } else alert("อัปเดตไม่สำเร็จ");
  };

  // ✅ ลบเกม
  const handleDelete = async (id) => {
    if (!window.confirm("ต้องการลบเกมนี้?")) return;
    await fetch(`${apiBase}/api/games/${id}`, { method: "DELETE" });
    setGames(games.filter(g => g.game_id !== id));
  };

  // ✅ เคลียร์ฟอร์ม
    const resetForm = () => {
      setEditing(null);
      setForm({
        title: '',
        price: '',
        category_name: '',
        platforms: [],
        release_date: '',
        image_url: '' // ✅ เพิ่มบรรทัดนี้
      });
    };


  if (!isAdmin) return null;

  return (
    <div className="backoffice-container">
      <header className="backoffice-header">
        <h1>แผงควบคุมผู้ดูแลระบบ</h1>
      </header>

      <section className="backoffice-actions">
        <div className="form-grid">
          
          <div className="form-group">
            <label>ลิงก์รูปภาพ (image_url):</label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://i.imgur.com/xxxx.jpg"
            />
          </div>

          <div className="form-group">
            <label>ชื่อเกม:</label>
            <input name="title" value={form.title} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>ราคา:</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>หมวดหมู่:</label>
            <select
              name="category_name"
              value={form.category_name}
              onChange={handleChange}
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              {categories.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>วันที่ขาย:</label>
            <input type="date" name="release_date" value={form.release_date} onChange={handleChange} />
          </div>

          <div className="form-group platforms-group">
            <label>แพลตฟอร์ม:</label>
            <div className="platforms-grid">
              {platforms.map(name => (
                <label key={name} className="platform-option">
                  {name}
                  <input
                    type="checkbox"
                    name="platforms"
                    value={name}
                    checked={form.platforms.includes(name)}
                    onChange={handleChange}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            {editing ? (
              <>
                <button className="btn save" onClick={handleSave}>บันทึก</button>
                <button className="btn cancel" onClick={resetForm}>ยกเลิก</button>
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
              <th>ราคา</th>
              <th>แพลตฟอร์ม</th>
              <th>วางขาย</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => (
              <tr key={game.game_id}>
                <td>{game.title}</td>
                <td>{game.category_name}</td>
                <td>฿{game.price}</td>
                <td>{game.platforms.join(', ')}</td>
                <td>{new Date(game.release_date).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <button className="btn-edit" onClick={() => handleEdit(game)}>แก้ไข</button>
                  <button className="btn-delete" onClick={() => handleDelete(game.game_id)}>ลบ</button>
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

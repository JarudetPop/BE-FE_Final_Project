const axios = require('axios');
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // แพ็กเกจสำหรับแก้ไข CORS

const app = express();
// อนุญาตให้ Frontend เข้าถึง API อย่างเฉพาะเจาะจงที่พอร์ต 3000 เท่านั้น
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000']
}));

app.use(express.json()); 

// ----------------------------------------------------
// 1. การตั้งค่า Pool สำหรับเชื่อมต่อ PostgreSQL
// ----------------------------------------------------
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST, 
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, 
});

pool.connect()
    .then(client => {
        console.log('✅ API Connected successfully to PostgreSQL database!');
        client.release();
    })
    .catch(err => {
        console.error('❌ Error connecting to database:', err.stack);
    });

// ----------------------------------------------------
// 2. Endpoint สำหรับดึงข้อมูลเกมทั้งหมด
// ----------------------------------------------------
app.get('/api/games', async (req, res) => {
    const query = `
        SELECT
            g.game_id,
            g.title,
            g.price,
            g.release_date,
            g.image_url,
            c.category_name,
            ARRAY_AGG(p.platform_name ORDER BY p.platform_name) AS platforms
        FROM games g
        JOIN categories c ON g.category_id = c.category_id
        JOIN game_platforms gp ON g.game_id = gp.game_id
        JOIN platforms p ON gp.platform_id = p.platform_id
        GROUP BY g.game_id, c.category_name
        ORDER BY g.game_id;
    `;
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', detail: err.message });
    }
});
// ✅ ดึงหมวดหมู่ทั้งหมด
app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT category_name 
            FROM categories
            ORDER BY category_name;
        `);
        res.json(result.rows); // ตัวอย่าง: [{ category_name: "Action" }, ...]
    } catch (err) {
        res.status(500).json({ error: 'Failed to load categories', detail: err.message });
    }
});

// ✅ ดึงแพลตฟอร์มทั้งหมด
app.get('/api/platforms', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT platform_name
            FROM platforms
            ORDER BY platform_name;
        `);
        res.json(result.rows); // ตัวอย่าง: [{ platform_name: "PC" }, ...]
    } catch (err) {
        res.status(500).json({ error: 'Failed to load platforms', detail: err.message });
    }
});

// ✅ ดึง 20 เกมล่าสุด
app.get('/api/games/latest', async (req, res) => {
    try {
        const query = `
            SELECT
                g.game_id,
                g.title,
                g.price,
                g.release_date,
                g.image_url,
                c.category_name,
                ARRAY_AGG(p.platform_name ORDER BY p.platform_name) AS platforms
            FROM games g
            JOIN categories c ON g.category_id = c.category_id
            JOIN game_platforms gp ON g.game_id = gp.game_id
            JOIN platforms p ON gp.platform_id = p.platform_id
            GROUP BY g.game_id, c.category_name
            ORDER BY g.release_date DESC
            LIMIT 20;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load latest games', detail: err.message });
    }
});


// ----------------------------------------------------
// 3. เริ่มต้น Server
// ----------------------------------------------------
const PORT = process.env.PORT || 8080; // ใช้พอร์ต 8080 เพื่อไม่ให้ชนกับ React 3000
// ✅ หา image จาก Steam โดยใช้ชื่อเกม
app.get('/api/steam/search', async (req, res) => {
    const { title } = req.query;
    if (!title) return res.status(400).json({ error: "Missing title" });

    try {
        // 1) ค้นหา AppID จาก Steam store search API
        const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&l=english&cc=US`;
        const searchRes = await axios.get(searchUrl);

        if (!searchRes.data.items || searchRes.data.items.length === 0) {
            return res.json({ image_url: null });
        }

        const appId = searchRes.data.items[0].id;

        // 2) ดึงข้อมูลละเอียดเพื่อเอาลิงก์ปก
        const detailUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
        const detailRes = await axios.get(detailUrl);

        const data = detailRes.data[appId].data;
        const image_url = data.header_image || null;

        res.json({ image_url });

    } catch (err) {
        return res.status(500).json({ error: "Fetch failed", detail: err.message });
    }
});
app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
});

// 4
app.post('/api/games', async (req, res) => {
    const { title, price, release_date, category_name, platforms, image_url } = req.body;
    try {
        const client = await pool.connect();
        await client.query('BEGIN');

        const catRes = await client.query(
            'SELECT category_id FROM categories WHERE category_name = $1',
            [category_name]
        );

        if (catRes.rowCount === 0) throw new Error('Invalid category');
        const category_id = catRes.rows[0].category_id;

        const gameRes = await client.query(
            // SQL คาดหวัง $5
            `INSERT INTO games (title, price, release_date, category_id, image_url)
             VALUES ($1, $2, $3, $4, $5) RETURNING game_id`,
            // 🚀 แก้ไข: ต้องส่งพารามิเตอร์ 5 ตัว ($5 = image_url)
            [title, price, release_date, category_id, image_url] 
        );

        const game_id = gameRes.rows[0].game_id;

        for (const name of platforms) {
            const platRes = await client.query(
                'SELECT platform_id FROM platforms WHERE platform_name = $1',
                [name]
            );
            if (platRes.rowCount > 0) {
                const platform_id = platRes.rows[0].platform_id;
                await client.query(
                    'INSERT INTO game_platforms (game_id, platform_id) VALUES ($1, $2)',
                    [game_id, platform_id]
                );
            }
        }

        await client.query('COMMIT');
        client.release();
        res.status(201).json({ message: 'Game added successfully' });
    } catch (err) {
        // ต้อง ROLLBACK ในกรณีที่เกิดข้อผิดพลาด
        try {
            if (client) await client.query('ROLLBACK');
        } catch (rollbackError) {
            console.error('Error during rollback:', rollbackError);
        }

        res.status(500).json({ error: 'Failed to add game', detail: err.message });
    }
});

// delete
app.delete('/api/games/:id', async (req, res) => {
    const gameId = req.params.id;
    try {
        await pool.query('DELETE FROM game_platforms WHERE game_id = $1', [gameId]);
        await pool.query('DELETE FROM games WHERE game_id = $1', [gameId]);
        res.json({ message: 'Game deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete game', detail: err.message });
    }
});
//put
app.put('/api/games/:id', async (req, res) => {
    const gameId = req.params.id;
    const { title, price, release_date, category_name, platforms, image_url } = req.body; // ✅ เพิ่ม image_url ที่นี่ด้วย

    try {
        const client = await pool.connect();
        await client.query('BEGIN');

        const catRes = await client.query(
            'SELECT category_id FROM categories WHERE category_name = $1',
            [category_name]
        );

        if (catRes.rowCount === 0) throw new Error('Invalid category');
        const category_id = catRes.rows[0].category_id;
        
        // 🚀 แก้ไข: เพิ่ม image_url เข้าไปใน UPDATE statement
        await client.query(
            `UPDATE games SET title=$1, price=$2, release_date=$3, category_id=$4, image_url=$5 WHERE game_id=$6`,
            [title, price, release_date, category_id, image_url, gameId] // ❌ แก้ไข: ต้องมี 6 พารามิเตอร์
        );

        await client.query('DELETE FROM game_platforms WHERE game_id=$1', [gameId]);

        for (const name of platforms) {
            const platRes = await client.query('SELECT platform_id FROM platforms WHERE platform_name=$1', [name]);
            if (platRes.rowCount > 0) {
                const platform_id = platRes.rows[0].platform_id;
                await client.query(
                    'INSERT INTO game_platforms (game_id, platform_id) VALUES ($1, $2)',
                    [gameId, platform_id]
                );
            }
        }

        await client.query('COMMIT');
        client.release();
        res.json({ message: 'Game updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update game', detail: err.message });
    }
});
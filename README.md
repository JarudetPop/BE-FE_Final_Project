# BE-FE_Final_Project - GameStore Application

🎮 Full-Stack Game Store Application พัฒนาด้วย **React (Frontend)** และ **Go (Backend)** ทำงานบน **Docker** และ **PostgreSQL**

## 📋 ภาพรวมโปรเจกต์

GameStore เป็นแอปพลิเคชันสำหรับจัดการและจำหน่ายเกมออนไลน์ ประกอบด้วย:

- **Frontend**: React UI เพื่อแสดงรายการเกม
- **Backend**: Go API สำหรับบริหารจัดการข้อมูล
- **Database**: PostgreSQL สำหรับเก็บข้อมูล
- **Infrastructure**: Docker Compose สำหรับการจัดการ services

## 🎯 ฟีเจอร์หลัก

### สำหรับผู้ใช้ทั่วไป
- ✅ ดูรายการเกมที่พร้อมใช้งาน
- ✅ ค้นหาเกมตามหมวดหมู่
- ✅ สมัครสมาชิกและเข้าสู่ระบบ
- ✅ ดูรายละเอียดเกม

### สำหรับผู้ดูแลระบบ (Admin)
- ✅ เพิ่มเกมใหม่
- ✅ แก้ไขข้อมูลเกม
- ✅ ลบเกมออกจากระบบ
- ✅ จัดการผู้ใช้

## 🏗️ โครงสร้าง

```
BE-FE_Final_Project/
├── GameStoreDB/                 # Database & Backend Docker
│   ├── docker/
│   │   ├── dockerfile          # PostgreSQL Dockerfile
│   │   └── init.sql            # Database initialization
│   ├── docker-compose.yml       # Docker Compose configuration
│   └── .env                     # Environment variables
│
├── backend/                     # Go Backend API
│   ├── main.go                 # Main application
│   ├── go.mod                  # Go modules
│   ├── Dockerfile              # Backend Docker image
│   ├── .env                    # Backend env config
│   └── README.md               # Backend documentation
│
├── web/                         # React Frontend
│   ├── src/
│   │   ├── pages/              # Pages components
│   │   ├── components/         # Reusable components
│   │   ├── styles/             # CSS styles
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── public/
│
├── SETUP.md                     # Setup guide
└── README.md                    # This file
```

## 🚀 การเริ่มต้นใช้งาน

### ข้อกำหนดเบื้องต้น

- Docker & Docker Compose
- Node.js 18+ (สำหรับ Frontend)
- Git

### การติดตั้งและรัน

**ขั้นตอนที่ 1**: Clone repository และเข้า directory

```bash
git clone <repository-url>
cd BE-FE_Final_Project
```

**ขั้นตอนที่ 2**: รัน Backend & Database

```bash
cd GameStoreDB
docker-compose up -d
```

Services ที่เริ่มทำงาน:
- PostgreSQL Database: `localhost:5432`
- Go Backend API: `http://localhost:8080`
- pgAdmin: `http://localhost:5050`

**ขั้นตอนที่ 3**: รัน Frontend

```bash
cd ../web
npm install
npm start
```

Frontend จะเปิดที่: `http://localhost:3000`

### ข้อมูลการ Login เริ่มต้น

**Admin Account:**
- Username: `Admin`
- Password: `Admin123`

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "Admin",
  "password": "Admin123"
}
```

**Signup**
```http
POST /auth/signup
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123"
}
```

### Games Endpoints

**ดึงรายการเกมทั้งหมด**
```http
GET /games
```

**ดึงเกมตาม ID**
```http
GET /games/{id}
```

**สร้างเกมใหม่** (Admin only)
```http
POST /games
Content-Type: application/json

{
  "title": "Game Name",
  "price": 1999.00,
  "category": "แอคชั่น",
  "platforms": ["PC (Steam)", "PlayStation 5"],
  "release_date": "2025-11-06",
  "image_url": "url_to_image",
  "created_by": 1
}
```

**แก้ไขเกม** (Admin only)
```http
PUT /games/{id}
Content-Type: application/json

{
  "title": "Updated Name",
  "price": 2099.00,
  ...
}
```

**ลบเกม** (Admin only)
```http
DELETE /games/{id}
```

### Health Check
```http
GET /health
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Games Table
```sql
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  platforms TEXT NOT NULL,
  release_date DATE,
  image_url TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠️ Technology Stack

### Frontend
- **React** 18.2.0 - UI Framework
- **React Router** 6.14.0 - Routing
- **CSS3** - Styling

### Backend
- **Go** 1.21 - Programming Language
- **Gorilla Mux** - HTTP Router
- **lib/pq** - PostgreSQL Driver
- **bcrypt** - Password Hashing

### Database & Infrastructure
- **PostgreSQL** 17 - Database
- **Docker** - Containerization
- **Docker Compose** - Container Orchestration
- **pgAdmin** - Database Management UI

## 📚 Documentation

- [Setup Guide](./SETUP.md) - คำแนะนำการตั้งค่า
- [Backend README](./backend/README.md) - เอกสาร Backend

## 🔐 Security Features

- ✅ Password hashing ด้วย bcrypt
- ✅ User authentication & authorization
- ✅ CORS support
- ✅ Admin role management
- ✅ SQL injection prevention (prepared statements)

## 📝 Default Environment Variables

### Backend (.env)
```env
DB_HOST=db
DB_PORT=5432
DB_USER=GameStoreDB_user
DB_PASSWORD=HandSome1234
DB_NAME=GameStoreDB
PORT=8080
```

### Database (.env)
```env
POSTGRES_DB=GameStoreDB
POSTGRES_USER=GameStoreDB_user
POSTGRES_PASSWORD=HandSome1234
POSTGRES_PORT=5432
PGADMIN_DEFAULT_EMAIL=Kwach2547@gmail.com
PGADMIN_DEFAULT_PASSWORD=HandSome1234
PGADMIN_PORT=5050
```

## 🧪 Testing

### Manual Testing
- ใช้ Postman หรือ Insomnia สำหรับทดสอบ API
- ใช้ pgAdmin สำหรับทดสอบ Database

### Health Check
```bash
curl http://localhost:8080/health
```

## 📦 Deployment

### Development
```bash
docker-compose up -d
npm start
```

### Production
สำหรับการใช้ Production ควร:
1. เปลี่ยน credentials
2. ตั้งค่า environment secrets
3. Enable HTTPS
4. Implement JWT tokens
5. Add rate limiting
6. Configure specific CORS origins

## 🐛 Troubleshooting

### Backend Connection Error
```bash
# Check if containers are running
docker-compose ps

# View logs
docker-compose logs api
```

### Database Connection Failed
```bash
# Restart services
docker-compose restart

# Check database status
docker-compose logs db
```

### Frontend Cannot Reach API
1. ตรวจสอบ backend รัน: `curl http://localhost:8080/health`
2. ตรวจสอบ browser console สำหรับ CORS errors
3. ตรวจสอบ network tab ใน Dev Tools

ดูรายละเอียด troubleshooting ใน [SETUP.md](./SETUP.md)

## 📞 Support & Issues

สำหรับปัญหาใด ๆ:
1. ตรวจสอบ logs: `docker-compose logs`
2. ตรวจสอบ documentation
3. ตรวจสอบ code comments

## 📋 TODO / Future Enhancements

- [ ] JWT Token Authentication
- [ ] User Dashboard
- [ ] Shopping Cart
- [ ] Payment Integration
- [ ] Reviews & Ratings
- [ ] Search & Filter
- [ ] Pagination
- [ ] Unit Tests
- [ ] E2E Tests
- [ ] CI/CD Pipeline
- [ ] Performance Optimization
- [ ] Caching Strategy

## 📄 License

Educational purposes only - สำหรับการเรียนรู้ Backend & Frontend Development

## 👥 Contributors

- Backend Developer: Go/Database
- Frontend Developer: React
- DevOps: Docker

## 📆 Project Timeline

- **Started**: November 2025
- **Status**: In Development ✅
- **Last Updated**: November 20, 2025

---

**Happy Coding! 🚀**

สำหรับรายละเอียดเพิ่มเติม โปรดดู [SETUP.md](./SETUP.md)

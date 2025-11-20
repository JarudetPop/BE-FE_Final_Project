# Setup Guide - BE-FE_Final_Project

คำแนะนำในการตั้งค่าและรัน GameStore Project ทั้ง Backend และ Frontend

## สิ่งที่ต้องการ

1. **Docker & Docker Compose** - สำหรับรัน Backend และ Database
2. **Node.js & npm** - สำหรับรัน Frontend
3. **Git** - สำหรับ version control

## โครงสร้างของ Project

```
BE-FE_Final_Project/
├── GameStoreDB/           # Database & Backend Docker setup
│   ├── docker/
│   │   ├── dockerfile
│   │   └── init.sql
│   ├── docker-compose.yml
│   └── .env
├── backend/               # Go Backend Application
│   ├── main.go
│   ├── go.mod
│   ├── go.sum
│   ├── Dockerfile
│   ├── .env
│   └── README.md
├── web/                   # React Frontend Application
│   ├── package.json
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── styles/
│   └── ...
└── README.md
```

## ขั้นตอนการตั้งค่า

### 1. Clone Repository

```bash
git clone <repository-url>
cd BE-FE_Final_Project
```

### 2. ตั้งค่า Backend & Database

#### ขั้นตอนที่ 1: เปลี่ยนไปที่ folder GameStoreDB

```bash
cd GameStoreDB
```

#### ขั้นตอนที่ 2: ตรวจสอบไฟล์ `.env`

ไฟล์ `.env` ควรมีค่าเหล่านี้:
```env
POSTGRES_DB=GameStoreDB
POSTGRES_USER=GameStoreDB_user
POSTGRES_PASSWORD=HandSome1234
POSTGRES_PORT=5432
PGADMIN_DEFAULT_EMAIL=Kwach2547@gmail.com
PGADMIN_DEFAULT_PASSWORD=HandSome1234
PGADMIN_PORT=5050
```

#### ขั้นตอนที่ 3: รัน Docker Compose

```bash
docker-compose up -d
```

Services ที่จะเริ่มทำงาน:
- **PostgreSQL Database**: `localhost:5432`
- **pgAdmin**: `http://localhost:5050`
- **Go Backend API**: `http://localhost:8080`

#### ขั้นตอนที่ 4: ตรวจสอบว่า services ทำงาน

```bash
# ตรวจสอบ containers
docker-compose ps

# ตรวจสอบ health check
curl http://localhost:8080/health
```

### 3. ตั้งค่า Frontend

#### ขั้นตอนที่ 1: เปลี่ยนไปที่ folder web

```bash
cd ../web
```

#### ขั้นตอนที่ 2: ติดตั้ง dependencies

```bash
npm install
```

#### ขั้นตอนที่ 3: รัน development server

```bash
npm start
```

Frontend จะเปิดที่ `http://localhost:3000`

## การใช้งาน

### Login ดำเนินการ (Admin)

1. ไปที่หน้าบ้าน `http://localhost:3000`
2. คลิก "เข้าสู่ระบบ"
3. ใช้ credentials:
   - Username: `Admin`
   - Password: `Admin123`
4. คุณจะถูกนำไปยังหน้า Backoffice

### ฟีเจอร์หลัก

#### หน้าแรก (Home)
- ดูรายการเกมที่พร้อมใช้งาน
- Login/Signup ผู้ใช้ใหม่
- Carousel ของเกมยอดนิยม

#### Backoffice (Admin Only)
- **ดู**: รายการเกมทั้งหมด
- **เพิ่ม**: เกมใหม่
- **แก้ไข**: ข้อมูลเกม
- **ลบ**: เกมออกจากระบบ

### API Endpoints

**Base URL**: `http://localhost:8080`

#### Authentication
```
POST /api/auth/login
POST /api/auth/signup
```

#### Games
```
GET    /api/games              # ดึงรายการเกมทั้งหมด
GET    /api/games/{id}         # ดึงเกมตาม ID
POST   /api/games              # สร้างเกมใหม่ (Admin)
PUT    /api/games/{id}         # แก้ไขเกม (Admin)
DELETE /api/games/{id}         # ลบเกม (Admin)
```

## Troubleshooting

### Backend ไม่เชื่อมต่อ

1. ตรวจสอบ containers ทำงาน
```bash
docker-compose ps
```

2. ดูหาข้อผิดพลาด
```bash
docker-compose logs api
docker-compose logs db
```

3. Restart services
```bash
docker-compose restart
```

### Frontend ไม่เรียก API ได้

1. ตรวจสอบว่า Backend รัน
```bash
curl http://localhost:8080/health
```

2. ตรวจสอบ browser console สำหรับข้อผิดพลาด CORS

3. ตรวจสอบ network tab ใน Dev Tools

### Database Connection Error

1. ตรวจสอบ PostgreSQL รัน
```bash
docker exec gamestore-db psql -U GameStoreDB_user -d GameStoreDB -c "SELECT 1"
```

2. ตรวจสอบ credentials ใน `.env`

3. ลบ volume และสร้างใหม่
```bash
docker-compose down -v
docker-compose up -d
```

### Port ถูกใช้งาน

ถ้า port ถูกใช้งานแล้ว:

**Linux/Mac:**
```bash
lsof -i :3000      # Frontend
lsof -i :8080      # Backend
lsof -i :5432      # Database
lsof -i :5050      # pgAdmin
```

**Windows:**
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :5432
netstat -ano | findstr :5050
```

แล้วเปลี่ยน port ใน `.env` หรือ `package.json`

## Development Workflow

### 1. เริ่มต้นวัน

```bash
# Terminal 1: Backend & Database
cd GameStoreDB
docker-compose up -d

# Terminal 2: Frontend
cd web
npm start
```

### 2. ระหว่างการพัฒนา

- Frontend auto-reload เมื่อ save
- Backend ต้อง restart ด้วยตนเอง (ยังไม่มี hot reload)

```bash
# Restart Backend
docker-compose restart api
```

### 3. สิ้นสุดวัน

```bash
# ปิด all services
docker-compose down

# หรือถ้าอยากเก็บ data
docker-compose stop
```

## Advanced Configuration

### pgAdmin Access

1. ไปที่ `http://localhost:5050`
2. Login ด้วย:
   - Email: `Kwach2547@gmail.com`
   - Password: `HandSome1234`

3. Add server:
   - Host: `db`
   - Port: `5432`
   - Username: `GameStoreDB_user`
   - Password: `HandSome1234`

### ดูหา Logs

```bash
# Backend logs
docker-compose logs api -f

# Database logs
docker-compose logs db -f

# All services
docker-compose logs -f
```

### Environment Variables

#### Backend (.env)
```env
DB_HOST=db
DB_PORT=5432
DB_USER=GameStoreDB_user
DB_PASSWORD=HandSome1234
DB_NAME=GameStoreDB
PORT=8080
```

#### Frontend (hardcoded)
- API Base URL: `http://localhost:8080`

## Security Notes

⚠️ **สำหรับ Production:**

1. เปลี่ยน default passwords
2. ใช้ environment secrets
3. Enable HTTPS
4. Implement JWT tokens
5. Add rate limiting
6. Sanitize user inputs
7. Use specific CORS origins

## Performance Tips

1. **Database Indexing**: ดู `init.sql` สำหรับ indexes
2. **Connection Pooling**: Go มี built-in connection pooling
3. **Frontend Caching**: แนะนำให้ใช้ React Query หรือ SWR
4. **Image Optimization**: Optimize game images

## Resource Links

- [Go Documentation](https://golang.org/doc)
- [React Documentation](https://reactjs.org)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [Gorilla Mux](https://github.com/gorilla/mux)

## Support

สำหรับปัญหาหรือคำถามใดๆ กรุณา:

1. ตรวจสอบ error messages ใน logs
2. ตรวจสอบ documentation ใน `backend/README.md`
3. ตรวจสอบ code comments

## Version

- Go: 1.21
- Node.js: 18+ recommended
- React: 18.2.0
- PostgreSQL: 17

---

**Last Updated**: November 2025
**Status**: Production Ready ✅

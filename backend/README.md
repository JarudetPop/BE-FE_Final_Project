# GameStore API - Backend

Backend service สำหรับ GameStore Application ที่พัฒนาด้วย Go และ PostgreSQL

## คุณสมบัติ

- ✅ Authentication (Login & Signup) 
- ✅ CRUD Operations สำหรับการบริหารจัดการเกม
- ✅ User management (Admin & Regular User)
- ✅ Password hashing ด้วย bcrypt
- ✅ CORS support สำหรับการเชื่อมต่อจากหน้าบ้าน
- ✅ Database connection pooling

## Requirements

- Go 1.21 หรือสูงกว่า
- Docker & Docker Compose
- PostgreSQL 17

## API Endpoints

### Authentication
- `POST /api/auth/login` - เข้าสู่ระบบ
  - Request: `{ "username": "string", "password": "string" }`
  - Response: `{ "id": int, "username": "string", "email": "string", "is_admin": bool, "message": "string" }`

- `POST /api/auth/signup` - สมัครสมาชิก
  - Request: `{ "username": "string", "email": "string", "password": "string" }`
  - Response: `{ "id": int, "username": "string", "email": "string", "is_admin": bool, "message": "string" }`

### Games
- `GET /api/games` - ดึงรายการเกมทั้งหมด
  - Response: `[{ "id": int, "title": "string", "price": float, "category": "string", "platforms": ["string"], "release_date": "string", "image_url": "string", "created_by": int, "created_at": "timestamp" }]`

- `GET /api/games/{id}` - ดึงข้อมูลเกมตาม ID
  - Response: เกม object

- `POST /api/games` - สร้างเกมใหม่ (Admin only)
  - Request: `{ "title": "string", "price": float, "category": "string", "platforms": ["string"], "release_date": "string", "image_url": "string", "created_by": int }`
  - Response: เกม object ที่สร้างขึ้น

- `PUT /api/games/{id}` - แก้ไขข้อมูลเกม (Admin only)
  - Request: `{ "title": "string", "price": float, "category": "string", "platforms": ["string"], "release_date": "string", "image_url": "string" }`
  - Response: เกม object ที่แก้ไข

- `DELETE /api/games/{id}` - ลบเกม (Admin only)
  - Response: Status 204 No Content

### Health Check
- `GET /health` - ตรวจสอบสถานะของเซิร์ฟเวอร์
  - Response: `{ "status": "healthy" }`

## การตั้งค่าและการรัน

### ใช้ Docker Compose

1. ไปที่ folder `GameStoreDB`
```bash
cd GameStoreDB
```

2. รัน Docker Compose
```bash
docker-compose up -d
```

3. เซิร์ฟเวอร์จะเริ่มทำงานที่ `http://localhost:8080`

### การรัน Local (ไม่ใช้ Docker)

1. ติดตั้ง dependencies
```bash
go mod download
```

2. ตั้งค่า Environment variables (สร้าง `.env` file)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=GameStoreDB_user
DB_PASSWORD=HandSome1234
DB_NAME=GameStoreDB
PORT=8080
```

3. รัน application
```bash
go run main.go
```

## Database Schema

### users table
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

### games table
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

## ข้อมูลการ Login เริ่มต้น

Admin User:
- Username: `Admin`
- Password: `Admin123`

## Directory Structure

```
backend/
├── main.go           # Main application file
├── go.mod           # Go modules file
├── go.sum           # Go modules checksum
├── Dockerfile       # Docker configuration
├── .env            # Environment variables
└── README.md       # This file
```

## Dependencies

- github.com/gorilla/mux - HTTP router
- github.com/lib/pq - PostgreSQL driver
- golang.org/x/crypto - Password hashing
- github.com/joho/godotenv - Environment variable loader

## CORS Configuration

API รองรับ CORS requests จากทุก origin ใช้เพื่อการพัฒนา

**Important:** สำหรับ Production ควรกำหนด specific origins แทน

## Error Handling

API จะส่ง HTTP status codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Deletion successful
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource (e.g., username)
- `500 Internal Server Error` - Server error

## Security Notes

- Password ถูก hash ด้วย bcrypt
- ควรเพิ่ม JWT tokens สำหรับ production
- ควรเพิ่ม rate limiting
- ควรจำกัด CORS origins
- ควรใช้ HTTPS

## การพัฒนาต่อไป

- [ ] JWT Authentication
- [ ] User role management
- [ ] Pagination for games listing
- [ ] Search and filter games
- [ ] Game ratings and reviews
- [ ] Transaction management
- [ ] Logging system
- [ ] Unit tests

## Troubleshooting

### Database Connection Error
- ตรวจสอบว่า PostgreSQL container กำลังรัน
- ตรวจสอบ environment variables
- ตรวจสอบ port 5432

### Port Already in Use
```bash
# Linux/Mac
lsof -i :8080

# Windows
netstat -ano | findstr :8080
```

## License

Educational purposes only

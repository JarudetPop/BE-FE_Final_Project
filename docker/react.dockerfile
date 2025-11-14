# docker/react.dockerfile
# ใช้ Node.js เป็น base image
FROM node:20-alpine 

# กำหนด working directory ภายใน container
WORKDIR /app

# เพิ่ม Path ของ node_modules/.bin เพื่อให้เข้าถึง scripts ได้ง่าย
ENV PATH /app/node_modules/.bin:$PATH

# 1. คัดลอก package.json และ package-lock.json จากโฟลเดอร์ web/ มาติดตั้ง dependencies
# เนื่องจากใน docker-compose เรากำหนด context: ./web ไว้
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# 2. คัดลอกโค้ด React ที่เหลือทั้งหมด
COPY . .

# 3. คำสั่งเริ่มต้น: รันคำสั่ง start ที่อยู่ใน package.json ของ React
CMD ["npm", "start"]
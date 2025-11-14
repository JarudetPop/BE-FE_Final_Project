# docker/api.dockerfile
FROM node:20-alpine
WORKDIR /app

# 1. ติดตั้ง Dependencies
COPY server/package.json server/package-lock.json ./
RUN npm install

# 2. คัดลอกโค้ด
COPY server/ .

# 3. คำสั่งเริ่มต้น
CMD ["npm", "start"]
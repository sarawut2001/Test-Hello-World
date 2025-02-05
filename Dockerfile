# ใช้ Node.js base image
FROM node:22

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ทั้งหมดไปยัง container
COPY . .

# ติดตั้ง dependencies
RUN npm install

# เปิด port 3000
EXPOSE 3000

# รันแอปพลิเคชัน
CMD ["npm", "start"]

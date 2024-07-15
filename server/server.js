const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const knex = require('knex')(require('./knexfile').development); // Knex 설정 불러오기
const port = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json()); // JSON 요청을 파싱하기 위해 추가

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// 클라이언트가 메시지를 보낼 때
io.on('connection', (socket) => {
  console.log('New client connected');

  // 데이터베이스에서 기존 메시지를 불러오기
  knex.select('*').from('messages').then(data => {
    socket.emit('init', data);
  });

  socket.on('message', (message) => {
    const newMessage = { content: message };
    // 데이터베이스에 메시지 저장
    knex('messages').insert(newMessage).then(() => {
      io.emit('message', newMessage); // 모든 클라이언트로 메시지 전송
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => console.log(`Server running on port ${port}`));

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const db = require('./db');
const createTables = require('./models/createTables');




require('dotenv').config();

const app = express();
const server = http.createServer(app);



const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    methods: ["GET","POST"]
  }
});

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173"
}));
app.use(express.json());

// serve uploaded avatars
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

// routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users_all'));
app.use('/users', require('./routes/users'));
// app.use('/users', require('./routes/users_all'));
app.use('/contacts', require('./routes/contacts'));


// Simple routes
app.get('/ping', (req,res)=>res.json({ok:true}));

// Messages REST endpoints
app.get('/messages/:chatId', async (req,res)=>{
  const { chatId } = req.params;
  try {
    const result = await db.query('SELECT * FROM messages WHERE chat_id=$1 ORDER BY created_at ASC', [chatId]);
    res.json(result.rows);
  } catch(err){
    console.error(err);
    res.status(500).json({error:'db'});
  }
});

app.post('/messages', async (req,res)=>{
  const { chat_id, sender_id, text } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO messages(chat_id, sender_id, text) VALUES($1,$2,$3) RETURNING *',
      [chat_id, sender_id, text]
    );
    const message = result.rows[0];
    io.to(chat_id).emit('newMessage', message);
    res.json(message);
  } catch(err){
    console.error(err);
    res.status(500).json({error:'db'});
  }
});

// Socket.io
io.on('connection', socket=>{
  console.log('socket connected', socket.id);
  socket.on('join', (chatId)=>{
    socket.join(chatId);
    console.log('joined', chatId);
  });
  socket.on('leave', (chatId)=>{
    socket.leave(chatId);
  });
  socket.on('sendMessage', async (payload)=>{
    // payload: {chat_id, sender_id, text}
    try {
      const r = await db.query(
        'INSERT INTO messages(chat_id, sender_id, text) VALUES($1,$2,$3) RETURNING *',
        [payload.chat_id, payload.sender_id, payload.text]
      );
      const message = r.rows[0];
      io.to(payload.chat_id).emit('newMessage', message);
    } catch(err){ console.error(err); }
  });
});

const PORT = process.env.PORT || 4000;

// initialize tables then start
(async ()=>{
  await createTables();
  server.listen(PORT, ()=>console.log('Server running on', PORT));
})();

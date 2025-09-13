const db = require('./db');
const bcrypt = require('bcrypt');

async function seed(){
  try{
    // create dummy users
    const p1 = await bcrypt.hash('password1', 10);
    const p2 = await bcrypt.hash('password2', 10);
    const p3 = await bcrypt.hash('password3', 10);

    await db.query("INSERT INTO users (name,email,password_hash,avatar_url) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING", ['Alice','alice@example.com',p1,null]);
    await db.query("INSERT INTO users (name,email,password_hash,avatar_url) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING", ['Bob','bob@example.com',p2,null]);
    await db.query("INSERT INTO users (name,email,password_hash,avatar_url) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING", ['Carol','carol@example.com',p3,null]);

    // create chats
    await db.query("INSERT INTO chats (id, title) VALUES ($1,$2) ON CONFLICT DO NOTHING", ['room-1','General']);
    await db.query("INSERT INTO chats (id, title) VALUES ($1,$2) ON CONFLICT DO NOTHING", ['room-2','Support']);

    // create messages
    await db.query("INSERT INTO messages (chat_id, sender_id, text) VALUES ($1,$2,$3)", ['room-1', 1, 'Welcome to General chat!']);
    await db.query("INSERT INTO messages (chat_id, sender_id, text) VALUES ($1,$2,$3)", ['room-1', 2, 'Hi everyone!']);
    await db.query("INSERT INTO messages (chat_id, sender_id, text) VALUES ($1,$2,$3)", ['room-2', 3, 'Support chat here.']);

    // create contacts for user 1 (Alice)
    await db.query("INSERT INTO contacts (user_id, contact_user_id, nickname) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING", [1,2,'Bobby']);
    await db.query("INSERT INTO contacts (user_id, contact_user_id, nickname) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING", [1,3,'Caz']);

    console.log('Seed complete');
    process.exit(0);
  }catch(err){ console.error(err); process.exit(1); }
}

seed();

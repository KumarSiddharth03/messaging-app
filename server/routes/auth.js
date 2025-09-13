const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req,res)=>{
  const { name, email, password } = req.body;
  if(!email || !password || !name) return res.status(400).json({error:'missing'});
  try{
    const hash = await bcrypt.hash(password, 10);
    const r = await db.query('INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email,avatar_url', [name,email,hash]);
    const user = r.rows[0];
    const token = jwt.sign({id: user.id, name: user.name}, process.env.JWT_SECRET || 'dev-secret', {expiresIn:'7d'});
    res.json({user, token});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'db'});
  }
});

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({error:'missing'});
  try{
    const r = await db.query('SELECT * FROM users WHERE email=$1', [email]);
    if(r.rows.length===0) return res.status(401).json({error:'invalid'});
    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if(!ok) return res.status(401).json({error:'invalid'});
    const token = jwt.sign({id: user.id, name: user.name}, process.env.JWT_SECRET || 'dev-secret', {expiresIn:'7d'});
    res.json({user: {id:user.id,name:user.name,email:user.email,avatar_url:user.avatar_url}, token});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'db'});
  }
});

module.exports = router;

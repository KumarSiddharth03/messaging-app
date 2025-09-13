const express = require('express');
const db = require('../db');
const auth = require('../auth');

const router = express.Router();

router.get('/all', async (req,res)=>{
  try{
    const r = await db.query('SELECT id,name,email,avatar_url FROM users ORDER BY id DESC LIMIT 200');
    res.json(r.rows);
  }catch(err){ console.error(err); res.status(500).json({error:'db'}) }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const db = require('../db');
const auth = require('../auth');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// get current user
router.get('/me', auth, async (req,res)=>{
  try{
    const r = await db.query('SELECT id,name,email,avatar_url,created_at FROM users WHERE id=$1', [req.user.id]);
    if(r.rows.length===0) return res.status(404).json({error:'not found'});
    res.json(r.rows[0]);
  }catch(err){ console.error(err); res.status(500).json({error:'db'}) }
});

// get user profile
router.get('/:id', auth, async (req,res)=>{
  const id = req.params.id;
  try{
    const r = await db.query('SELECT id,name,email,avatar_url,created_at FROM users WHERE id=$1', [id]);
    if(r.rows.length===0) return res.status(404).json({error:'not found'});
    res.json(r.rows[0]);
  }catch(err){ console.error(err); res.status(500).json({error:'db'}) }
});

// update profile (name or avatar)
router.put('/:id', auth, upload.single('avatar'), async (req,res)=>{
  const id = req.params.id;
  if(parseInt(req.user.id)!==parseInt(id)) return res.status(403).json({error:'forbidden'});
  const { name } = req.body;
  let avatar_url = null;
  if(req.file){
    // serve via /uploads route
    avatar_url = `/uploads/${req.file.filename}`;
  }
  try{
    if(avatar_url){
      await db.query('UPDATE users SET name=$1, avatar_url=$2 WHERE id=$3', [name, avatar_url, id]);
    } else {
      await db.query('UPDATE users SET name=$1 WHERE id=$2', [name, id]);
    }
    const r = await db.query('SELECT id,name,email,avatar_url FROM users WHERE id=$1', [id]);
    res.json(r.rows[0]);
  }catch(err){ console.error(err); res.status(500).json({error:'db'}) }
});

module.exports = router;

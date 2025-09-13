const express = require('express');
const db = require('../db');
const auth = require('../auth');

const router = express.Router();

// get contacts for a user
router.get('/:userId', auth, async (req,res)=>{
  const userId = req.params.userId;
  try{
    const r = await db.query(`
      SELECT c.id, c.nickname, u.id as contact_user_id, u.name, u.email, u.avatar_url
      FROM contacts c JOIN users u ON c.contact_user_id = u.id
      WHERE c.user_id=$1`, [userId]);
    res.json(r.rows);
  }catch(err){ console.error(err); res.status(500).json({error:'db'}) }
});

// add contact
router.post('/', auth, async (req,res)=>{
  const { user_id, contact_user_id, nickname } = req.body;
  try{
    const r = await db.query('INSERT INTO contacts(user_id, contact_user_id, nickname) VALUES($1,$2,$3) RETURNING *', [user_id, contact_user_id, nickname]);
    res.json(r.rows[0]);
  }catch(err){ console.error(err); res.status(500).json({error:'db'}) }
});

// update contact
router.put('/:id', auth, async (req,res)=>{
  const id = req.params.id;
  const { nickname } = req.body;
  try{
    await db.query('UPDATE contacts SET nickname=$1 WHERE id=$2', [nickname, id]);
    const r = await db.query('SELECT * FROM contacts WHERE id=$1', [id]);
    res.json(r.rows[0]);
  }catch(err){ console.error(err); res.status(500).json({error:'db'}) }
});

// delete contact
router.delete('/:id', auth, async (req,res)=>{
  const id = req.params.id;
  try{
    await db.query('DELETE FROM contacts WHERE id=$1', [id]);
    res.json({ok:true});
  }catch(err){ console.error(err); res.status(500).json({error:'db'}) }
});

module.exports = router;

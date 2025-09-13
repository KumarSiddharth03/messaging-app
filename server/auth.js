const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error:'missing token'});
  const parts = auth.split(' ');
  if(parts.length !== 2) return res.status(401).json({error:'malformed token'});
  const token = parts[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = payload;
    next();
  }catch(err){
    return res.status(401).json({error:'invalid token'});
  }
};

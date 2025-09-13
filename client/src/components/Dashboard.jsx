import React, { useState } from 'react';
import API from '../api';

export default function Dashboard({ user, setUser }){
  const [name, setName] = useState(user.name||'');
  const [file, setFile] = useState(null);

  const save = async ()=>{
    try{
      const form = new FormData();
      form.append('name', name);
      if(file) form.append('avatar', file);
      const r = await API.put(`/users/${user.id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(r.data);
    }catch(err){ console.error(err) }
  }

  return (
    <div className="dashboard">
      <h3>Profile</h3>
      <img src={user.avatar_url||'/default-avatar.png'} alt="a" className="avatar-large"/>
      <div><input value={name} onChange={e=>setName(e.target.value)}/></div>
      <div><input type="file" onChange={e=>setFile(e.target.files[0])}/></div>
      <button onClick={save}>Save</button>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import API from '../api';

export default function ContactsSection({ user }){
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(()=>{ if(!user) return; API.get(`/contacts/${user.id}`).then(r=>setContacts(r.data)).catch(()=>{}); API.get('/users/all').then(r=>setUsers(r.data)).catch(()=>{}); },[user]);

  const add = async ()=>{
    if(!selected) return;
    await API.post('/contacts', { user_id: user.id, contact_user_id: selected, nickname });
    const r = await API.get(`/contacts/${user.id}`); setContacts(r.data); setNickname(''); setSelected('');
  }
  const removeContact = async (id)=>{ await API.delete(`/contacts/${id}`); setContacts(prev=>prev.filter(c=>c.id!==id)); }

  return (
    <div className="contacts-section">
      <h3>Your Contacts</h3>
      <div className="contacts-list">
        {contacts.map(c=>(
          <div key={c.id} className="contact-row">
            <img src={c.avatar_url || '/default-avatar.png'} alt="a" className="avatar"/>
            <div className="meta"><div className="name">{c.name}</div><div className="email">{c.email}</div></div>
            <button onClick={()=>removeContact(c.id)}>Remove</button>
          </div>
        ))}
      </div>
      <hr/>
      <h4>Add Contact</h4>
      <select value={selected} onChange={e=>setSelected(e.target.value)}>
        <option value=''>-- pick user --</option>
        {users.filter(u=>u.id!==user.id).map(u=> <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
      </select>
      <input placeholder="nickname (optional)" value={nickname} onChange={e=>setNickname(e.target.value)}/>
      <button onClick={add}>Add</button>
    </div>
  );
}

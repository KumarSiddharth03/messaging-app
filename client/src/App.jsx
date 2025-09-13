import React, { useEffect, useState } from 'react';
import Auth from './components/Auth';
import ChatSection from './components/ChatSection';
import ContactsSection from './components/ContactsSection';
import Dashboard from './components/Dashboard';
import API from './api';

export default function App(){
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      API.get('/users/me').then(r=>{ setUser(r.data); localStorage.setItem('user', JSON.stringify(r.data)); }).catch(()=>{ localStorage.removeItem('token'); });
    }
  },[]);

  if(!user) return <Auth setUser={(u)=>{ setUser(u); }} />;

  return (
    <div className="app">
      <div className="topbar">
        <h1>Message</h1>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button onClick={()=>{ setShowDashboard(false); setActiveTab('chat'); }}>Message</button>
          <button onClick={()=>setShowDashboard(true)}>Dashboard</button>
          <button onClick={()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.reload(); }}>Logout</button>
        </div>
      </div>
      <div className="body">
        <div className="sidebar">
          <div className="tabs">
            <button onClick={()=>{ setActiveTab('chat'); setShowDashboard(false); }} className={activeTab==='chat'?'active':''}>Chat</button>
            <button onClick={()=>{ setActiveTab('contacts'); setShowDashboard(false); }} className={activeTab==='contacts'?'active':''}>Contacts</button>
          </div>
          <div className="list"></div>
        </div>
        <div className="main">
          { showDashboard ? <Dashboard user={user} setUser={setUser} /> : (activeTab==='chat' ? <ChatSection user={user} /> : <ContactsSection user={user} />) }
        </div>
      </div>
    </div>
  );
}

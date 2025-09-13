import React, { useEffect, useState, useRef } from 'react';
import API from '../api';
import { io } from 'socket.io-client';

export default function ChatSection({ user }){
  
  const [chats, setChats] = useState([{id:'room-1',title:'General'},{id:'room-2',title:'Support'}]);
  const [active, setActive] = useState(chats[0]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef();





  useEffect(()=>{
    socketRef.current = io(import.meta.env.VITE_SERVER || 'http://localhost:4000');
    socketRef.current.on('newMessage', (m)=>{
      if(m.chat_id === active.id) setMessages(prev=>[...prev,m]);
    });
    return ()=>{ socketRef.current.disconnect(); }
  },[active]);

  useEffect(()=>{
    async function load(){ 
      if(!active) return;
      const r = await API.get(`/messages/${active.id}`);
      setMessages(r.data);
      socketRef.current.emit('join', active.id);
    }
    load();
    return ()=>{ if(socketRef.current) socketRef.current.emit('leave', active.id) }
  },[active]);

  const send = ()=>{
    if(!text) return;
    socketRef.current.emit('sendMessage', { chat_id: active.id, sender_id: user.id, text });
    setText('');
  }

  return (
    <div className="chat-section">
      <div className="chat-list">
        {chats.map(c=>(<div key={c.id} className={'chat-list-item'+(active.id===c.id?' active':'')} onClick={()=>setActive(c)}>{c.title}</div>))}
      </div>
      <div className="chat-main">
        <div className="chat-header">{active.title}</div>
        <div className="messages">
          {messages.map(m=>(
            <div key={m.id} className={'message '+(m.sender_id===user.id?'sent':'recv')}>
              <div className="bubble">{m.text}</div>
              <div className="time">{new Date(m.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="composer">
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message"/>
          <button onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}

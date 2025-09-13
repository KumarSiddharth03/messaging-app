import React, { useState } from 'react';
import API from '../api';

export default function Auth({ setUser }){
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email:'', password:'', name:'' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const url = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await API.post(url, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    }catch(err){ alert(err.response?.data?.error || 'Auth failed'); console.error(err) }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {!isLogin && <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>}
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        <p className="link" onClick={()=>setIsLogin(!isLogin)}>{isLogin ? 'Need account? Register' : 'Have account? Login'}</p>
      </form>
    </div>
  );
}

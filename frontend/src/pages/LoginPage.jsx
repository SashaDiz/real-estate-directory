import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Автозаполнение, если ранее были сохранены
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('adminLoginData'));
    if (saved && saved.username && saved.password) {
      setUsername(saved.username);
      setPassword(saved.password);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        if (remember) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('adminLoginData', JSON.stringify({ username, password }));
        } else {
          sessionStorage.setItem('token', data.token);
          localStorage.removeItem('adminLoginData');
        }
        navigate('/admin');
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch {
      setError('Ошибка соединения с сервером');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Вход в админ-панель</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1">Логин</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Пароль</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div className="mb-6 flex items-center">
          <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} className="mr-2" />
          <label htmlFor="remember">Запомнить меня на этом компьютере</label>
        </div>
        <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary/90 transition">Войти</button>
      </form>
    </div>
  );
} 
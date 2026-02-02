'use client';
import React, { useState } from 'react';
import { post } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await post<{ id: number; name: string; email: string; token: string }>('/api/auth/login', { email, password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', String(res.id));
        localStorage.setItem('userName', res.name);
        window.dispatchEvent(new Event('auth-change'));
      }
      router.push('/');
    } catch {
      setError('Credenciais inválidas');
    }
  }

  return (
    <main className="card">
      <h2>Entrar</h2>
      <form className="grid" onSubmit={submit}>
        {error && <div style={{ color: 'tomato' }}>{error}</div>}
        <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="button" type="submit">Entrar</button>
      </form>
    </main>
  );
}

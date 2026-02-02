'use client';
import React, { useState } from 'react';
import { post } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await post<{ id: number; name: string; email: string; token: string }>('/api/auth/register', { name, email, password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', String(res.id));
        localStorage.setItem('userName', res.name);
        window.dispatchEvent(new Event('auth-change'));
      }
      router.push('/');
    } catch {
      setError('Erro ao cadastrar');
    }
  }

  return (
    <main className="card">
      <h2>Cadastrar</h2>
      <form className="grid" onSubmit={submit}>
        {error && <div style={{ color: 'tomato' }}>{error}</div>}
        <input className="input" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
        <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="button" type="submit">Cadastrar</button>
      </form>
    </main>
  );
}

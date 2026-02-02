'use client';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../lib/api';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: string; name: string; email?: string } | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  useEffect(() => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    if (id && name) {
      setUser({ id, name, email: email || undefined });
      fetch(`${BASE_URL}/api/users/${id}/matches`).then(r => r.json()).then(setMatches).catch(() => setMatches([]));
    }
  }, []);

  if (!user) return <main className="card">Faça login para ver seu perfil.</main>;

  return (
    <main className="grid">
      <section className="card">
        <h2>Perfil</h2>
        <div>Nome: {user.name}</div>
        {user.email && <div>Email: {user.email}</div>}
      </section>
      <section className="card">
        <h3>Minhas partidas</h3>
        <div className="list">
          {matches.length === 0 && <div>Nenhuma partida.</div>}
          {matches.map(m => (
            <div key={m.id} className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div>{m.venue?.name} · {m.sportType}</div>
                <div>{new Date(m.startTime).toLocaleString('pt-BR')}</div>
              </div>
              <Link className="button" href={`/matches/${m.id}` as any}>Ver</Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

'use client';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function MatchDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [match, setMatch] = useState<any>(null);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch(`${BASE_URL}/api/matches/${params.id}`).then(r => r.json()).then(setMatch).catch(() => {});
    const uid = typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';
    setUserId(uid);
  }, [params.id]);
  async function reload() {
    const r = await fetch(`${BASE_URL}/api/matches/${params.id}`);
    const j = await r.json();
    setMatch(j);
  }
  async function join() {
    setError('');
    if (!userId) { setError('Faça login para entrar.'); return; }
    setLoading(true);
    const res = await fetch(`${BASE_URL}/api/matches/${params.id}/join?userId=${userId}`, { method: 'POST' });
    setLoading(false);
    if (!res.ok) { setError('Não foi possível entrar.'); return; }
    await reload();
  }
  async function leave() {
    setError('');
    if (!userId) { setError('Faça login para sair.'); return; }
    setLoading(true);
    const res = await fetch(`${BASE_URL}/api/matches/${params.id}/leave?userId=${userId}`, { method: 'POST' });
    setLoading(false);
    if (!res.ok) { setError('Não foi possível sair.'); return; }
    await reload();
  }
  if (!match) return <main className="card">Carregando...</main>;
  const isParticipant = !!userId && (match.participants || []).some((p: any) => String(p.id) === String(userId));
  return (
    <main className="card">
      <h2>Partida</h2>
      <div>{match.venue?.name} · {match.sportType}</div>
      <div>{new Date(match.startTime).toLocaleString('pt-BR')}</div>
      <div>Jogadores: {(match.participants?.length || 0)}/{match.maxPlayers}</div>
      {!userId && <div style={{ color: 'tomato' }}>Faça login para participar.</div>}
      <div className="row">
        <button className="button" disabled={!userId || loading || isParticipant} onClick={join}>Entrar</button>
        <button className="button" disabled={!userId || loading || !isParticipant} onClick={leave}>Sair</button>
      </div>
      {error && <div style={{ color: 'tomato' }}>{error}</div>}
    </main>
  );
}

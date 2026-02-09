'use client';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../../lib/api';
import Link from 'next/link';
import Avatar from '../../../components/Avatar';

export default function MatchDetail({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState<any>(null);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [arenaPlayers, setArenaPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [toast, setToast] = useState('');
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
  async function loadArenaPlayers() {
    if (!match?.venue?.id) return;
    const r = await fetch(`${BASE_URL}/api/arenas/${match.venue.id}/players`);
    const j = await r.json();
    setArenaPlayers(j || []);
  }
  async function searchUsers(q: string) {
    const r = await fetch(`${BASE_URL}/api/users?query=${encodeURIComponent(q)}`);
    const j = await r.json();
    setSearchResults(j || []);
  }
  async function openInvite() {
    setInviteOpen(true);
    await loadArenaPlayers();
    setSearch('');
    setSearchResults([]);
  }
  async function sendInvite(inviteeId: number) {
    if (!userId) { setError('Faça login para convidar.'); return; }
    const url = `${BASE_URL}/api/invites?matchId=${params.id}&inviterId=${userId}&inviteeId=${inviteeId}`;
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) { setError('Falha ao convidar.'); return; }
    setInviteOpen(false);
    setSearch('');
    setSearchResults([]);
    setArenaPlayers([]);
    setToast('Convite enviado');
    setTimeout(() => setToast(''), 3000);
  }
  if (!match) return <main className="card">Carregando...</main>;
  const isParticipant = !!userId && (match.participants || []).some((p: any) => String(p.id) === String(userId));
  const participants = match.participants || [];
  const organizerId = match.organizer?.id ? String(match.organizer.id) : null;
  const hasOrganizerInParticipants = organizerId ? participants.some((u: any) => String(u.id) === organizerId) : false;
  const playersCount = participants.length + (organizerId && !hasOrganizerInParticipants ? 1 : 0);
  const canInvite = !!userId && (isParticipant || organizerId === userId);
  return (
    <main className="card">
      <h2>Partida</h2>
      <div>{match.venue?.name} · {match.sportType}</div>
      {match.facility && <div className="text-muted">Instalação: {match.facility}</div>}
      <div>{new Date(match.startTime).toLocaleString('pt-BR')}</div>
      <div>Jogadores: {playersCount}/{match.maxPlayers}</div>
      <div className="row" style={{ gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
        {match.organizer && (
          <Link href={`/users/${match.organizer.id}`} className="row" style={{ gap: 8 }}>
            <Avatar src={match.organizer.avatarUrl} alt={match.organizer.name} size={32} name={match.organizer.name} />
            <span className="text-muted">{match.organizer.name} (organizador)</span>
          </Link>
        )}
        {(match.participants || []).map((u: any) => (
          <Link key={u.id} href={`/users/${u.id}`} className="row" style={{ gap: 8 }}>
            <Avatar src={u.avatarUrl} alt={u.name} size={32} name={u.name} />
            <span className="text-muted">{u.name}</span>
          </Link>
        ))}
      </div>
      {!userId && <div style={{ color: 'tomato' }}>Faça login para participar.</div>}
      <div className="row">
        <button className="button" disabled={!userId || loading || isParticipant} onClick={join}>Entrar</button>
        <button className="button" disabled={!userId || loading || !isParticipant} onClick={leave}>Sair</button>
        <button className="button" disabled={!canInvite} onClick={openInvite}>Convidar jogadores</button>
      </div>
      {error && <div style={{ color: 'tomato' }}>{error}</div>}
      {inviteOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 560, display: 'grid', gap: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h3>Convidar jogadores</h3>
              <button className="btn btn-secondary" onClick={() => setInviteOpen(false)}>Fechar</button>
            </div>
            <div>
              <div className="h4">Jogadores que já jogaram nesta arena</div>
              <div className="list">
                {arenaPlayers.length === 0 && <div>Nenhum histórico ainda.</div>}
                {arenaPlayers.map((u: any) => (
                  <div key={u.id} className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="row" style={{ gap: 8 }}>
                      <Avatar src={u.avatarUrl} alt={u.name} size={28} name={u.name} />
                      <div>{u.name}</div>
                      <div className="pill">Jogou {u.timesPlayed}x</div>
                    </div>
                    <button className="btn btn-primary" onClick={() => sendInvite(u.id)}>Convidar</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="h4">Buscar jogadores</div>
              <input className="input" placeholder="Digite um nome..." value={search} onChange={e => { setSearch(e.target.value); searchUsers(e.target.value); }} />
              <div className="list">
                {searchResults.map((u: any) => (
                  <div key={u.id} className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="row" style={{ gap: 8 }}>
                      <Avatar src={u.avatarUrl} alt={u.name} size={28} name={u.name} />
                      <div>{u.name}</div>
                    </div>
                    <button className="btn btn-primary" onClick={() => sendInvite(u.id)}>Convidar</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#22c55e', color: '#052e1a', padding: '12px 16px', borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.35)', fontWeight: 600 }}>
          {toast} ✅
        </div>
      )}
    </main>
  );
}

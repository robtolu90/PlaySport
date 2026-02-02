'use client';
import React, { useState } from 'react';
import { post } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function NewMatchPage() {
  const router = useRouter();
  const [sport, setSport] = useState('FUTSAL');
  const [venueId, setVenueId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(10);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = { sportType: sport, venue: { id: Number(venueId) }, startTime, maxPlayers };
    await post('/api/matches', body);
    router.push('/matches');
  }

  return (
    <main className="card">
      <h2>Criar partida</h2>
      <form className="grid" onSubmit={submit}>
        <label>Esporte</label>
        <select className="input" value={sport} onChange={e => setSport(e.target.value)}>
          <option value="FUTSAL">Futsal</option>
          <option value="BEACH_SOCCER">Beach Soccer</option>
          <option value="SOCCER">Soccer</option>
          <option value="BASKETBALL">Basquete</option>
          <option value="VOLLEYBALL">Vôlei</option>
        </select>
        <label>Campo (ID)</label>
        <input className="input" value={venueId} onChange={e => setVenueId(e.target.value)} placeholder="Ex: 1" />
        <label>Data e hora</label>
        <input className="input" type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
        <label>Máximo de jogadores</label>
        <input className="input" type="number" value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} />
        <button className="button" type="submit">Criar</button>
      </form>
    </main>
  );
}

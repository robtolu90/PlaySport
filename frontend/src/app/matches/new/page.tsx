'use client';
import React, { useState, useEffect } from 'react';
import { post, api } from '../../../lib/api';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NewMatchPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [sport, setSport] = useState('FUTSAL');
  const [venueId, setVenueId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [venues, setVenues] = useState<any[]>([]);
  const [facility, setFacility] = useState<string | null>(null);
  const [venueFacilities, setVenueFacilities] = useState<string[]>([]);

  useEffect(() => {
    api<any[]>('/api/venues').then(setVenues).catch(() => {});
  }, []);

  useEffect(() => {
    const s = search.get('sport');
    const v = search.get('venueId');
    const st = search.get('startTime');
    const f = search.get('facility');
    if (s) setSport(s);
    if (v) setVenueId(v);
    if (st) {
      const normalized = st.length >= 16 ? st.slice(0, 16) : st;
      setStartTime(normalized);
    }
    if (f) setFacility(f);
  }, [search]);

  useEffect(() => {
    async function loadFacilities() {
      if (!venueId) { setVenueFacilities([]); return; }
      try {
        const v = await api<any>(`/api/venues/${venueId}`);
        const items = (v.facilities || '').split(',').map((s: string) => s.trim()).filter(Boolean);
        const sportDefaults: Record<string, string[]> = {
          FUTSAL: ['Futsal Court A', 'Futsal Court B', 'Futsal Court C'],
          SOCCER: ['Football Pitch A', 'Football Pitch B', 'Football Pitch C'],
          BEACH_SOCCER: ['Beach Soccer A', 'Beach Soccer B', 'Beach Soccer C'],
          BASKETBALL: ['Basket Court A', 'Basket Court B'],
          VOLLEYBALL: ['Volleyball Court A', 'Volleyball Court B']
        };
        const list = items.length > 0 ? items : (sportDefaults[v.sportType] || ['Pitch A', 'Pitch B', 'Pitch C']);
        // Ensure the select options include either DB facilities or sensible defaults
        setVenueFacilities(list);
        // If facility came from query param but is not in list, append it temporarily
        if (facility && !list.includes(facility)) {
          setVenueFacilities([facility, ...list]);
        }
        // If no facility selected yet, pick the first option
        if (!facility) setFacility(list[0]);
      } catch {
        setVenueFacilities([]);
      }
    }
    loadFacilities();
  }, [venueId]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!facility) { alert('Selecione a instalação (ex.: Pitch A)'); return; }
    const normalizedStart = startTime.length === 16 ? `${startTime}:00` : startTime.length === 19 ? startTime : `${startTime}:00`;
    const organizerId = typeof window !== 'undefined' ? Number(localStorage.getItem('userId') || 0) : 0;
    if (!organizerId) { alert('Faça login para criar partida.'); return; }
    const body = { sportType: sport, venue: { id: Number(venueId) }, organizer: { id: organizerId }, startTime: normalizedStart, maxPlayers, facility };
    try {
      await post('/api/matches', body);
      router.push('/matches');
    } catch (err: any) {
      alert('Erro ao criar partida. ' + (err?.message || ''));
    }
  }

  return (
    <main className="card">
      <h2>Criar partida</h2>
      {facility && (
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="pill">Instalação: {facility}</span>
          {startTime && <span className="pill">Início: {new Date(startTime).toLocaleString('pt-BR')}</span>}
        </div>
      )}
      <form className="grid" onSubmit={submit}>
        <label>Esporte</label>
        <select className="input" value={sport} onChange={e => setSport(e.target.value)}>
          <option value="FUTSAL">Futsal</option>
          <option value="BEACH_SOCCER">Beach Soccer</option>
          <option value="SOCCER">Soccer</option>
          <option value="BASKETBALL">Basquete</option>
          <option value="VOLLEYBALL">Vôlei</option>
        </select>
        <label>Campo</label>
        <select className="input" value={venueId} onChange={e => setVenueId(e.target.value)} required>
            <option value="">Selecione um campo...</option>
            {venues.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
            ))}
        </select>
        <label>Instalação</label>
        <select className="input" value={facility || ''} onChange={e => setFacility(e.target.value || null)} required disabled={!venueId}>
          <option value="">{venueId ? 'Selecione uma instalação...' : 'Selecione um campo primeiro...'}</option>
          {venueFacilities.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <label>Data e hora</label>
        <input className="input" type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
        <label>Máximo de jogadores</label>
        <input className="input" type="number" value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} />
        <button className="button" type="submit" disabled={!venueId || !facility}>Criar</button>
      </form>
    </main>
  );
}

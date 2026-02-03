import Link from 'next/link';
import { BASE_URL } from '../../lib/api';

async function getMatches(sport?: string, from?: string, to?: string) {
  const params = new URLSearchParams();
  if (sport) params.set('sport', sport as any);
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const res = await fetch(`${BASE_URL}/api/matches?${params.toString()}`);
  if (!res.ok) throw new Error('Erro ao carregar');
  return res.json();
}

export default async function MatchesPage({ searchParams }: { searchParams?: { sport?: string; from?: string; to?: string } }) {
  const sport = searchParams?.sport;
  const from = searchParams?.from;
  const to = searchParams?.to;
  const matches = await getMatches(sport, from, to);
  return (
    <main className="grid">
      <div className="page-header">
        <div className="h1">Partidas</div>
        <Link className="btn btn-primary" href="/matches/new">Criar partida</Link>
      </div>
      <div className="card">
        <div className="section">
          <div className="h2">Filtros</div>
          <form className="row" action="/matches">
            <select className="input" name="sport" defaultValue={sport || ''}>
              <option value="">Todos</option>
              <option value="FUTSAL">Futsal</option>
              <option value="BEACH_SOCCER">Beach Soccer</option>
              <option value="SOCCER">Soccer</option>
              <option value="BASKETBALL">Basquete</option>
              <option value="VOLLEYBALL">Vôlei</option>
            </select>
            <input className="input" type="date" name="from" defaultValue={from || ''} />
            <input className="input" type="date" name="to" defaultValue={to || ''} />
            <button className="btn btn-secondary" type="submit">Buscar</button>
          </form>
        </div>
      </div>
      <div className="list">
        {matches.map((m: any) => (
          <div key={m.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div className="h2">{m.venue?.name} · {m.sportType}</div>
                <div className="text-muted">{new Date(m.startTime).toLocaleString('pt-BR')}</div>
                <div className="text-muted">{(m.participants?.length || 0)}/{m.maxPlayers} jogadores</div>
              </div>
              <Link className="btn btn-tertiary" href={`/matches/${m.id}`}>Ver</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

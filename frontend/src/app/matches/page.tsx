import { BASE_URL } from '../../lib/api';
import PageHeader from '../../components/PageHeader';
import MatchFilterBar from '../../components/MatchFilterBar';
import MatchCard from '../../components/MatchCard';

async function getMatches(sport?: string, from?: string, to?: string) {
  const params = new URLSearchParams();
  if (sport) params.set('sport', sport as any);
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const res = await fetch(`${BASE_URL}/api/matches?${params.toString()}`, { cache: 'no-store' });
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
      <PageHeader
        title="Partidas"
        description="Encontre partidas abertas e entre com um clique."
        actionHref="/matches/new"
        actionLabel="Criar partida"
      />
      <MatchFilterBar defaultSport={sport} defaultFrom={from} defaultTo={to} />
      <div className="list">
        {matches.map((m: any) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    </main>
  );
}

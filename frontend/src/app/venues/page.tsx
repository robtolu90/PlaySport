import { BASE_URL } from '../../lib/api';
import PageHeader from '../../components/PageHeader';
import FilterBar from '../../components/FilterBar';
import ListCard from '../../components/ListCard';

async function getVenues(city?: string, sport?: string) {
  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (sport) params.set('sport', sport as any);
  const res = await fetch(`${BASE_URL}/api/venues?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Erro ao carregar');
  return res.json();
}

export default async function VenuesPage({ searchParams }: { searchParams?: { city?: string; sport?: string } }) {
  const city = searchParams?.city;
  const sport = searchParams?.sport;
  const venues = await getVenues(city, sport);
  return (
    <main className="grid">
      <PageHeader
        title="Campos"
        description="Descubra e reserve campos esportivos perto de você"
        actionHref="/venues/new"
        actionLabel="+ Criar Campo"
      />
      <FilterBar defaultCity={city} defaultSport={sport} />
      <div className="list">
        {venues.map((v: any) => (
          <ListCard key={v.id} venue={v} />
        ))}
      </div>
    </main>
  );
}

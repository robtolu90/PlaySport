import Link from 'next/link';
import { BASE_URL } from '../../lib/api';

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
      <div className="page-header">
        <div className="h1">Campos</div>
        <Link className="btn btn-primary" href="/venues/new">Criar Campo</Link>
      </div>
      <div className="card">
        <div className="section">
          <div className="h2">Filtros</div>
          <form className="row" action="/venues">
            <input className="input" name="city" placeholder="Cidade" defaultValue={city || ''} />
            <select className="input" name="sport" defaultValue={sport || ''}>
              <option value="">Todos</option>
              <option value="FUTSAL">Futsal</option>
              <option value="BEACH_SOCCER">Beach Soccer</option>
              <option value="SOCCER">Soccer</option>
              <option value="BASKETBALL">Basquete</option>
              <option value="VOLLEYBALL">Vôlei</option>
            </select>
            <button className="btn btn-secondary" type="submit">Buscar</button>
          </form>
        </div>
      </div>
      <div className="list">
        {venues.map((v: any) => (
          <div key={v.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div className="h2">{v.name}</div>
                <div className="text-muted">{v.city} · {v.sportType}</div>
              </div>
              <Link className="btn btn-tertiary" href={`/venues/${v.id}`}>Ver</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

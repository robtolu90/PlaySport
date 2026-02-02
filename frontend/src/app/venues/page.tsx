import Link from 'next/link';
import { BASE_URL } from '../../lib/api';

async function getVenues(city?: string, sport?: string) {
  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (sport) params.set('sport', sport as any);
  const res = await fetch(`${BASE_URL}/api/venues?${params.toString()}`);
  if (!res.ok) throw new Error('Erro ao carregar');
  return res.json();
}

export default async function VenuesPage({ searchParams }: { searchParams?: { city?: string; sport?: string } }) {
  const city = searchParams?.city;
  const sport = searchParams?.sport;
  const venues = await getVenues(city, sport);
  return (
    <main className="grid">
      <div className="card">
        <h2>Campos</h2>
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
          <button className="button" type="submit">Buscar</button>
        </form>
      </div>
      <div className="list">
        {venues.map((v: any) => (
          <div key={v.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div>{v.name}</div>
                <div>{v.city}</div>
              </div>
              <Link className="button" href={`/venues/${v.id}`}>Ver</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

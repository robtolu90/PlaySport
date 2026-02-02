import { BASE_URL } from '../../../lib/api';

export default async function VenueDetail({ params }: { params: { id: string } }) {
  const res = await fetch(`${BASE_URL}/api/venues/${params.id}`, { cache: 'no-store' });
  const venue = await res.json();
  return (
    <main className="card">
      <h2>{venue.name}</h2>
      <div>{venue.city}</div>
      <div>{venue.address}</div>
      <div>Esporte: {venue.sportType}</div>
      <div>Máx jogadores: {venue.maxPlayers}</div>
    </main>
  );
}

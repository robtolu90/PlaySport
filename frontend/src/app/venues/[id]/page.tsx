'use client';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../../lib/api';
import { useParams } from 'next/navigation';

export default function VenueDetailsPage() {
  const params = useParams();
  const [venue, setVenue] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [nearby, setNearby] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmHour, setConfirmHour] = useState<number | null>(null);

  useEffect(() => {
    if (params.id) {
      fetch(`${BASE_URL}/api/venues/${params.id}`)
        .then(r => r.json())
        .then((v) => {
          setVenue(v);
        })
        .catch(console.error);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id && selectedDate) {
      fetch(`${BASE_URL}/api/bookings/venue/${params.id}?date=${selectedDate}`)
        .then(r => r.json())
        .then(setBookings)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id, selectedDate]);

  useEffect(() => {
    if (params.id) {
      fetch(`${BASE_URL}/api/bookings/venue/${params.id}/recent?limit=5`)
        .then(r => r.json())
        .then(setRecentBookings)
        .catch(() => setRecentBookings([]));
    }
  }, [params.id]);

  // Load nearby venues in same city and compute availability for selected date
  useEffect(() => {
    if (venue && venue.city) {
      fetch(`${BASE_URL}/api/venues?city=${encodeURIComponent(venue.city)}&sport=${venue.sportType}`)
        .then(r => r.json())
        .then(async (list) => {
          const others = (list || []).filter((v: any) => v.id !== venue.id).slice(0, 5);
          const withAvailability = await Promise.all(others.map(async (v: any) => {
            try {
              const bs = await fetch(`${BASE_URL}/api/bookings/venue/${v.id}?date=${selectedDate}`).then(r => r.json());
              const totalSlots = 15; // 8..22
              const available = Math.max(0, totalSlots - (bs?.length || 0));
              return { ...v, availableSlots: available };
            } catch {
              return { ...v, availableSlots: 0 };
            }
          }));
          setNearby(withAvailability);
        })
        .catch(() => setNearby([]));
    }
  }, [venue, selectedDate]);

  const openConfirm = (hour: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Faça login para reservar.');
      return;
    }
    setConfirmHour(hour);
  };

  const confirmBooking = async () => {
    if (confirmHour == null) return;
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    const startTime = `${selectedDate}T${confirmHour.toString().padStart(2, '0')}:00:00`;

    try {
      const res = await fetch(`${BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId: params.id,
          userId,
          startTime
        })
      });

      if (res.ok) {
        setConfirmHour(null);
        // Refresh bookings
        const updated = await fetch(`${BASE_URL}/api/bookings/venue/${params.id}?date=${selectedDate}`).then(r => r.json());
        setBookings(updated);
        alert('Reserva realizada com sucesso!');
      } else {
        const msg = await res.text();
        alert('Erro ao reservar: ' + msg);
      }
    } catch (e) {
      alert('Erro ao reservar');
    }
  };

  if (!venue) return <main className="card">Carregando...</main>;

  // Generate slots from 8 to 22
  const slots = Array.from({ length: 15 }, (_, i) => i + 8);
  const todayLocal = new Date();
  const todayStr = todayLocal.toLocaleDateString('en-CA'); // YYYY-MM-DD local
  const isSelectedDatePast = (() => {
    const sel = new Date(selectedDate);
    const start = new Date();
    start.setHours(0,0,0,0);
    return sel.getTime() < start.getTime();
  })();
  const filteredSlots = slots.filter(h => {
    if (selectedDate === todayStr) {
      const currentHour = todayLocal.getHours();
      return h > currentHour;
    }
    return true;
  });

  const renderFacilities = () => {
    const items = (venue.facilities || '').split(',').map((s: string) => s.trim()).filter(Boolean);
    if (items.length === 0) return null;
    return (
      <section className="card">
        <h3>Facilities</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {items.map((f: string, idx: number) => (
            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              ✓ {f}
            </span>
          ))}
        </div>
      </section>
    );
  };

  const mapUrl = venue.latitude && venue.longitude
    ? `https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`
    : `https://www.google.com/maps/search/${encodeURIComponent(`${venue.address || ''} ${venue.city || ''}`)}`;

  return (
    <main className="grid">
      <section className="card">
        <h2>{venue.name}</h2>
        {venue.imageUrl && <img src={venue.imageUrl} alt={venue.name} style={{width: '100%', height: 300, objectFit: 'cover', borderRadius: 8, marginBottom: '1rem'}} />}
        <p><strong>Esporte:</strong> {venue.sportType}</p>
        <p><strong>Local:</strong> {venue.city}, {venue.address}</p>
        <p><strong>Preço:</strong> R$ {venue.hourlyRate}/hora</p>
        <p>{venue.description}</p>
      </section>

      {renderFacilities()}

      <section className="card">
        <h3>Address</h3>
        <p>{venue.address}</p>
        <p>{venue.city}</p>
        <a className="button" href={mapUrl} target="_blank" rel="noreferrer">Ver no mapa</a>
      </section>

      <section className="card">
        <h3>Reservar Horário</h3>
        <div style={{marginBottom: '1rem'}}>
            <label>Data: </label>
            <input 
                type="date" 
                className="input" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)} 
            />
        </div>

        {isSelectedDatePast && (
          <div style={{marginBottom: '1rem', color: '#666'}}>Todos os horários desta data já passaram.</div>
        )}

        <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem'}}>
            {filteredSlots.map(hour => {
                const isBooked = bookings.some(b => {
                    const bookingHour = new Date(b.startTime).getHours();
                    return bookingHour === hour;
                });
                
                return (
                    <button 
                        key={hour} 
                        className={`button ${isBooked ? 'disabled' : ''}`}
                        style={{
                            backgroundColor: isBooked ? '#ccc' : '#28a745', 
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            opacity: isBooked ? 0.6 : 1
                        }}
                        disabled={isBooked}
                        onClick={() => openConfirm(hour)}
                    >
                        {hour}:00 - {hour+1}:00
                        <br/>
                        <small>{isBooked ? 'Ocupado' : 'Livre'}</small>
                    </button>
                );
            })}
        </div>
      </section>

      <section className="card">
        <h3>Últimas reservas</h3>
        <div className="list">
          {recentBookings.length === 0 && <div>Nenhuma reserva recente.</div>}
          {recentBookings.map((b: any) => (
            <div key={b.id} className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div>{new Date(b.startTime).toLocaleString('pt-BR')}</div>
                <small>Status: {b.status}</small>
              </div>
              <div>R$ {b.price}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Campos próximos</h3>
        <div className="list">
          {nearby.length === 0 && <div>Nenhum campo próximo.</div>}
          {nearby.map((v: any) => (
            <div key={v.id} className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {v.imageUrl && <img src={v.imageUrl} alt={v.name} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />}
                <div>
                  <div style={{ fontWeight: 600 }}>{v.name}</div>
                  <div style={{ color: '#666' }}>{v.city}</div>
                  <div style={{ color: '#28a745' }}>{v.availableSlots} bookings available</div>
                </div>
              </div>
              <a className="button" href={`/venues/${v.id}`}>Ver</a>
            </div>
          ))}
        </div>
      </section>

      {confirmHour !== null && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: 360 }}>
            <h3>Confirmar reserva</h3>
            <p>Você quer reservar {confirmHour}:00 - {confirmHour + 1}:00 em {selectedDate}?</p>
            <div className="row" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="button" style={{ backgroundColor: '#ccc' }} onClick={() => setConfirmHour(null)}>Cancelar</button>
              <button className="button" onClick={confirmBooking}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

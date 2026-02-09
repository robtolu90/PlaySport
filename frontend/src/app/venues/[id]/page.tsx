'use client';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../../lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function VenueDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [venue, setVenue] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [nearby, setNearby] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmHour, setConfirmHour] = useState<number | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [dayMatches, setDayMatches] = useState<any[]>([]);
  const [refreshingAvailability, setRefreshingAvailability] = useState(false);
  const [isSavingBooking, setIsSavingBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

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
      const fetchAll = async () => {
        try {
          const [bs, ms] = await Promise.all([
            fetch(`${BASE_URL}/api/bookings/venue/${params.id}?date=${selectedDate}`).then(r => r.json()),
            fetch(`${BASE_URL}/api/matches?from=${selectedDate}&to=${selectedDate}`).then(r => r.json())
          ]);
          setBookings(bs || []);
          setDayMatches((ms || []).filter((m: any) => m?.venue?.id?.toString() === params.id?.toString()));
        } catch (e) {
          console.error(e);
          setBookings([]);
          setDayMatches([]);
        } finally {
          setLoading(false);
        }
      };
      fetchAll();
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
    setSelectedFacility(null);
    const dateStr = selectedDate;
    if (params.id && dateStr) {
      setRefreshingAvailability(true);
      Promise.all([
        fetch(`${BASE_URL}/api/bookings/venue/${params.id}?date=${dateStr}`).then(r => r.json()),
        fetch(`${BASE_URL}/api/matches?from=${dateStr}&to=${dateStr}`).then(r => r.json())
      ])
        .then(([bs, ms]) => {
          setBookings(bs || []);
          setDayMatches((ms || []).filter((m: any) => m?.venue?.id?.toString() === params.id?.toString()));
        })
        .catch(() => {
          setBookings([]);
          setDayMatches([]);
        })
        .finally(() => setRefreshingAvailability(false));
    }
  };

  const continueToCreateMatch = () => {
    if (confirmHour == null || !selectedFacility || !venue) return;
    const startTime = `${selectedDate}T${confirmHour.toString().padStart(2, '0')}:00:00`;
    const url = `/matches/new?venueId=${venue.id}&startTime=${encodeURIComponent(startTime)}&facility=${encodeURIComponent(selectedFacility)}&sport=${venue.sportType}`;
    router.push(url as any);
  };
  
  const createBooking = async () => {
    if (confirmHour == null || !selectedFacility || !venue) return;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Faça login para reservar.');
      return;
    }
    const startTime = `${selectedDate}T${confirmHour.toString().padStart(2, '0')}:00:00`;
    setIsSavingBooking(true);
    setBookingError('');
    setBookingSuccess('');
    try {
      const res = await fetch(`${BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId: venue.id,
          userId,
          startTime,
          facility: selectedFacility
        })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Erro ao criar reserva');
      }
      const created = await res.json();
      setBookingSuccess('Reserva confirmada');
      // Refresh lists: day bookings and recent bookings
      const [bs, recent] = await Promise.all([
        fetch(`${BASE_URL}/api/bookings/venue/${params.id}?date=${selectedDate}`).then(r => r.json()),
        fetch(`${BASE_URL}/api/bookings/venue/${params.id}/recent?limit=5`).then(r => r.json())
      ]);
      setBookings(bs || []);
      setRecentBookings(recent || []);
      // Close modal after short delay
      setTimeout(() => {
        setConfirmHour(null);
        setSelectedFacility(null);
        setBookingSuccess('');
      }, 800);
    } catch (e: any) {
      setBookingError(e?.message || 'Falha na reserva');
    } finally {
      setIsSavingBooking(false);
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

  const rawFacilities = (venue?.facilities || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  const sportDefaults: Record<string, string[]> = {
    FUTSAL: ['Futsal Court A', 'Futsal Court B', 'Futsal Court C'],
    SOCCER: ['Football Pitch A', 'Football Pitch B', 'Football Pitch C'],
    BEACH_SOCCER: ['Beach Soccer A', 'Beach Soccer B', 'Beach Soccer C'],
    BASKETBALL: ['Basket Court A', 'Basket Court B'],
    VOLLEYBALL: ['Volleyball Court A', 'Volleyball Court B']
  };
  const facilityItems = rawFacilities.length > 0 ? rawFacilities : (sportDefaults[venue?.sportType] || ['Pitch A', 'Pitch B', 'Pitch C']);
  const facilitiesCount = Math.max(1, facilityItems.length || 1);

  const renderFacilities = () => {
    const items = facilityItems;
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
                const bookedCount = bookings.filter(b => new Date(b.startTime).getHours() === hour).length;
                const isFull = bookedCount >= facilitiesCount;
                
                return (
                    <button 
                        key={hour} 
                        className={`button ${isFull ? 'disabled' : ''}`}
                        style={{
                            backgroundColor: isFull ? '#ef4444' : '#22c55e', 
                            cursor: isFull ? 'not-allowed' : 'pointer',
                            opacity: isFull ? 0.85 : 1
                        }}
                        disabled={isFull}
                        onClick={() => openConfirm(hour)}
                    >
                        {hour}:00 - {hour+1}:00
                        <br/>
                        <small>{isFull ? 'Sem instalações' : 'Disponível'}</small>
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
                <div>{new Date(b.createdAt ?? b.startTime).toLocaleString('pt-BR')}</div>
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
          <div className="card" style={{ width: 520, display: 'grid', gap: '12px' }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h3>Escolher instalação</h3>
              <span className="pill">{selectedDate} · {String(confirmHour).padStart(2,'0')}:00 - {String(confirmHour! + 1).padStart(2,'0')}:00</span>
            </div>
            {bookingError && <small style={{ color: '#ef4444' }}>{bookingError}</small>}
            {bookingSuccess && <small style={{ color: '#22c55e' }}>{bookingSuccess}</small>}
            <div className="list">
              {facilityItems.length === 0 && <div>Sem instalações cadastradas.</div>}
              {facilityItems.map((f: string) => {
                const isBookedByReservation = bookings.some(b => {
                  const h = new Date(b.startTime).getHours();
                  return h === confirmHour && (b.facility || '').trim() === f;
                });
                const isBookedByMatch = dayMatches.some(m => {
                  const h = new Date(m.startTime).getHours();
                  return h === confirmHour && (m.facility || '').trim() === f && m?.venue?.id === venue?.id;
                });
                const isBooked = isBookedByReservation || isBookedByMatch;
                const selected = selectedFacility === f;
                return (
                  <button
                    key={f}
                    className="btn btn-secondary"
                    disabled={isBooked}
                    onClick={() => setSelectedFacility(f)}
                    style={{
                      justifyContent: 'space-between',
                      borderColor: selected ? 'rgba(34,197,94,0.7)' : 'rgba(255,255,255,0.18)',
                      boxShadow: selected ? '0 0 0 2px rgba(34,197,94,0.35)' : 'none',
                      opacity: isBooked ? 0.6 : 1
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: isBooked ? '#ef4444' : '#22c55e' }} />
                      {f}
                    </span>
                    <span style={{ color: '#22c55e' }}>R$ {venue.hourlyRate?.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
            {refreshingAvailability && <small style={{ color: '#888' }}>Atualizando disponibilidade...</small>}
            <div className="row" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => { setConfirmHour(null); setSelectedFacility(null); }}>Cancelar</button>
              <button className="btn btn-primary" disabled={!selectedFacility || isSavingBooking} onClick={createBooking}>
                {isSavingBooking ? 'Reservando...' : 'Reservar'}
              </button>
              <button className="btn btn-secondary" disabled={!selectedFacility} onClick={continueToCreateMatch}>Criar partida</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

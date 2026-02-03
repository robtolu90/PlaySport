'use client';
import React, { useState } from 'react';
import { post } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function NewVenuePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [sportType, setSportType] = useState('FUTSAL');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [hourlyRate, setHourlyRate] = useState(50);
  const [description, setDescription] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [imageUrl, setImageUrl] = useState('');
  const [facilities, setFacilities] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = {
      name,
      sportType,
      address,
      city,
      hourlyRate,
      description,
      maxPlayers,
      imageUrl,
      facilities,
      latitude: 0.0,
      longitude: 0.0
    };
    try {
      await post('/api/venues', body);
      router.push('/venues');
    } catch (e) {
      alert('Erro ao criar campo');
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const data = new FormData();
      data.append('file', file);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data,
        });
        if (res.ok) {
          const json = await res.json();
          setImageUrl(json.url);
        } else {
          alert('Erro ao fazer upload da imagem');
        }
      } catch (err) {
        console.error(err);
        alert('Erro ao fazer upload da imagem');
      }
    }
  };

  return (
    <main className="grid">
      <div className="page-header">
        <div className="h1">Criar Campo</div>
      </div>
      <div className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
        <form className="grid" onSubmit={submit}>
          <div className="section">
            <div className="h2">Informações básicas</div>
            <label>Nome do Campo</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} required />
            <label>Esporte</label>
            <select className="input" value={sportType} onChange={e => setSportType(e.target.value)}>
              <option value="FUTSAL">Futsal</option>
              <option value="BEACH_SOCCER">Beach Soccer</option>
              <option value="SOCCER">Soccer</option>
              <option value="BASKETBALL">Basquete</option>
              <option value="VOLLEYBALL">Vôlei</option>
            </select>
            <label>Descrição</label>
            <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="section">
            <div className="h2">Localização</div>
            <label>Cidade</label>
            <input className="input" value={city} onChange={e => setCity(e.target.value)} required />
            <label>Endereço</label>
            <input className="input" value={address} onChange={e => setAddress(e.target.value)} required />
          </div>

          <div className="section">
            <div className="h2">Detalhes</div>
            <label>Preço/Hora</label>
            <input className="input" type="number" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} required />
            <label>Capacidade Máxima</label>
            <input className="input" type="number" value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} required />
            <label>Facilities (separadas por vírgula)</label>
            <input className="input" placeholder="ex: floodlights, changing rooms, free parking" value={facilities} onChange={e => setFacilities(e.target.value)} />
          </div>

          <div className="section">
            <div className="h2">Imagem</div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <div style={{ marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {imageUrl && <img src={imageUrl} alt="Preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }} />}
                <input type="file" onChange={handleFileChange} />
              </div>
            </label>
          </div>

          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" type="submit">Criar Campo</button>
          </div>
        </form>
      </div>
    </main>
  );
}

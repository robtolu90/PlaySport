'use client';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../lib/api';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      // Fetch full user details
      fetch(`${BASE_URL}/api/users/${id}`)
        .then(r => r.json())
        .then(data => {
          setUser(data);
          setFormData(data);
        })
        .catch(err => console.error('Error loading user:', err));

      // Fetch matches
      fetch(`${BASE_URL}/api/users/${id}/matches`)
        .then(r => r.json())
        .then(setMatches)
        .catch(() => setMatches([]));
    }
  }, []);

  const handleSave = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setFormData(updated);
        setIsEditing(false);
        // Update localStorage just in case
        localStorage.setItem('userName', updated.name);
        if (updated.email) localStorage.setItem('userEmail', updated.email);
      } else {
        alert('Erro ao salvar perfil');
      }
    } catch (e) {
      alert('Erro ao salvar perfil');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const data = new FormData();
      data.append('file', file);
      try {
        const res = await fetch(`${BASE_URL}/api/upload`, {
          method: 'POST',
          body: data,
        });
        if (res.ok) {
          const json = await res.json();
          setFormData({ ...formData, avatarUrl: json.url });
        } else {
          alert('Erro ao fazer upload da imagem');
        }
      } catch (err) {
        console.error(err);
        alert('Erro ao fazer upload da imagem');
      }
    }
  };

  if (!user) return <main className="card">Carregando perfil...</main>;

  return (
    <main className="grid">
      <div className="page-header">
        <div className="h1">Perfil</div>
        {!isEditing && <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Editar</button>}
      </div>
      <section className="card">

        {isEditing ? (
          <div className="form">
             <label style={{display: 'block', marginBottom: '0.5rem'}}>Nome
                <input className="input" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={{width: '100%', marginTop: '0.2rem'}} />
             </label>
             <label style={{display: 'block', marginBottom: '0.5rem'}}>Email
                <input className="input" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} style={{width: '100%', marginTop: '0.2rem'}} />
             </label>
             <label style={{display: 'block', marginBottom: '0.5rem'}}>Foto
                <div style={{ marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {formData.avatarUrl && <img src={formData.avatarUrl} alt="Preview" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }} />}
                    <input type="file" onChange={handleFileChange} />
                </div>
                {/* Fallback text input just in case */}
                <input className="input" placeholder="Ou cole a URL" value={formData.avatarUrl || ''} onChange={e => setFormData({...formData, avatarUrl: e.target.value})} style={{width: '100%', marginTop: '0.5rem'}} />
             </label>
             <label style={{display: 'block', marginBottom: '0.5rem'}}>Telefone
                <input className="input" value={formData.phoneNumber || ''} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} style={{width: '100%', marginTop: '0.2rem'}} />
             </label>
             <label style={{display: 'block', marginBottom: '0.5rem'}}>Cidade
                <input className="input" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} style={{width: '100%', marginTop: '0.2rem'}} />
             </label>
             <div className="row" style={{marginTop: '1rem', gap: '1rem'}}>
                 <button className="btn btn-primary" onClick={handleSave}>Salvar</button>
                 <button className="btn btn-secondary" onClick={() => { setIsEditing(false); setFormData(user); }}>Cancelar</button>
             </div>
          </div>
        ) : (
            <div>
                {user.avatarUrl && <img src={user.avatarUrl} alt="Avatar" style={{width: 64, height: 64, borderRadius: '50%', marginBottom: '1rem', objectFit: 'cover'}} />}
                <div style={{marginBottom: '0.5rem'}}><strong>Nome:</strong> {user.name}</div>
                <div style={{marginBottom: '0.5rem'}}><strong>Email:</strong> {user.email}</div>
                <div style={{marginBottom: '0.5rem'}}><strong>Telefone:</strong> {user.phoneNumber || '-'}</div>
                <div style={{marginBottom: '0.5rem'}}><strong>Cidade:</strong> {user.city || '-'}</div>
            </div>
        )}
      </section>
      <section className="card">
        <div className="h2">Minhas partidas</div>
        <div className="list">
          {matches.length === 0 && <div>Nenhuma partida.</div>}
          {matches.map(m => (
            <div key={m.id} className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div className="h2">{m.venue?.name} · {m.sportType}</div>
                <div className="text-muted">{new Date(m.startTime).toLocaleString('pt-BR')}</div>
              </div>
              <Link className="btn btn-tertiary" href={`/matches/${m.id}` as any}>Ver</Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

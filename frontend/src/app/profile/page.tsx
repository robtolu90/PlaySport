'use client';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../lib/api';
import Link from 'next/link';
import Avatar from '../../components/Avatar';
import MatchCard from '../../components/MatchCard';
import Skeleton from '../../components/ui/Skeleton';

export default function ProfilePage() {
  const [user, setUser] = useState<any | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState<'followers' | 'following' | null>(null);

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
      
      // Social lists
      fetch(`${BASE_URL}/api/social/followers/${id}`)
        .then(r => r.json())
        .then(setFollowers)
        .catch(() => setFollowers([]));
      fetch(`${BASE_URL}/api/social/following/${id}`)
        .then(r => r.json())
        .then(setFollowing)
        .catch(() => setFollowing([]));
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
        setToast('Perfil salvo');
        setTimeout(() => setToast(''), 3000);
      } else {
        setToast('Erro ao salvar perfil');
        setTimeout(() => setToast(''), 3000);
      }
    } catch (e) {
      setToast('Erro ao salvar perfil');
      setTimeout(() => setToast(''), 3000);
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

  if (!user) return (
    <main className="grid">
      <section className="card" style={{ padding: '24px' }}>
        <div className="row" style={{ gap: 16 }}>
          <Skeleton style={{ width: 72, height: 72, borderRadius: 999 }} />
          <div className="grid" style={{ gap: 8 }}>
            <Skeleton style={{ width: 180, height: 24 }} />
            <Skeleton style={{ width: 220, height: 16 }} />
            <div className="row" style={{ gap: 8 }}>
              <Skeleton style={{ width: 100, height: 24 }} />
              <Skeleton style={{ width: 100, height: 24 }} />
              <Skeleton style={{ width: 100, height: 24 }} />
            </div>
          </div>
        </div>
      </section>
      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <Skeleton style={{ width: 120, height: 22 }} />
          <Skeleton style={{ width: 60, height: 30 }} />
        </div>
        <div className="list" style={{ marginTop: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="row" style={{ gap: 12 }}>
              <Skeleton style={{ width: 24, height: 24, borderRadius: 6 }} />
              <Skeleton style={{ width: 220, height: 16 }} />
            </div>
          ))}
        </div>
      </section>
      <section className="card">
        <Skeleton style={{ width: 160, height: 22, marginBottom: 8 }} />
        <div className="grid" style={{ gap: '1rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} style={{ width: '100%', height: 120 }} />
          ))}
        </div>
      </section>
    </main>
  );

  return (
    <main className="grid">
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#22c55e', color: '#052e1a', padding: '12px 16px', borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.35)', fontWeight: 600 }}>
          {toast}
        </div>
      )}
      <section className="card" style={{ padding: '24px', boxShadow: 'var(--shadow-glow)' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="row" style={{ gap: 16 }}>
            <Avatar src={user.avatarUrl} alt={user.name} size={72} name={user.name} />
            <div>
              <div className="h1">{user.name}</div>
              <div className="text-muted">Jogador • {user.city || 'Sua cidade'}</div>
              <div className="row" style={{ gap: 8, marginTop: 8 }}>
                <button className="pill" onClick={() => setModal('following')}>{following.length} Seguindo</button>
                <button className="pill" onClick={() => setModal('followers')}>{followers.length} Seguidores</button>
                <span className="pill">{matches.length} Partidas</span>
              </div>
            </div>
          </div>
          {!isEditing && (
            <button className="btn btn-secondary" onClick={() => setIsEditing(true)} title="Editar">✏️ Editar</button>
          )}
        </div>
      </section>
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
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div className="h2">Informações</div>
                  <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>✏️</button>
                </div>
                <div className="list" style={{ marginTop: 8 }}>
                  <div className="row"><span style={{ width: 24 }}>👤</span><strong>Nome</strong><span style={{ marginLeft: 8 }}>{user.name}</span></div>
                  <div className="row"><span style={{ width: 24 }}>✉️</span><strong>Email</strong><span style={{ marginLeft: 8 }}>{user.email}</span></div>
                  <div className="row"><span style={{ width: 24 }}>📞</span><strong>Telefone</strong><span style={{ marginLeft: 8 }}>{user.phoneNumber || 'Adicionar'}</span></div>
                  <div className="row"><span style={{ width: 24 }}>📍</span><strong>Cidade</strong><span style={{ marginLeft: 8 }}>{user.city || 'Adicionar'}</span></div>
                </div>
            </div>
        )}
      </section>
      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="h2">Rede</div>
          <div className="row" style={{ gap: 8 }}>
            <span className="pill">Seguidores: {followers.length}</span>
            <span className="pill">Seguindo: {following.length}</span>
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
          <div>
            <div className="h2" style={{ marginBottom: 8 }}>Seguidores</div>
            <div className="list">
              {followers.length === 0 && <div>Ninguém te segue ainda.</div>}
              {followers.map((u: any) => (
                <Link key={u.id} href={`/users/${u.id}`} className="row" style={{ gap: 8 }}>
                  <Avatar src={u.avatarUrl} alt={u.name} size={28} name={u.name} />
                  <div>{u.name}</div>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="h2" style={{ marginBottom: 8 }}>Seguindo</div>
            <div className="list">
              {following.length === 0 && <div>Você ainda não segue ninguém.</div>}
              {following.map((u: any) => (
                <Link key={u.id} href={`/users/${u.id}`} className="row" style={{ gap: 8 }}>
                  <Avatar src={u.avatarUrl} alt={u.name} size={28} name={u.name} />
                  <div>{u.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="card">
        <div className="h2">Atividade</div>
        <div className="grid">
          {matches.length === 0 && <div>Você ainda não participou de partidas.</div>}
          {matches.map(m => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </section>
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 520, display: 'grid', gap: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="h2">{modal === 'followers' ? 'Seguidores' : 'Seguindo'}</div>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Fechar</button>
            </div>
            <div className="list">
              {(modal === 'followers' ? followers : following).map((u: any) => (
                <Link key={u.id} href={`/users/${u.id}`} className="row" style={{ gap: 8, justifyContent: 'space-between' }}>
                  <div className="row" style={{ gap: 8 }}>
                    <Avatar src={u.avatarUrl} alt={u.name} size={28} name={u.name} />
                    <div>{u.name}</div>
                  </div>
                  <span className="pill">{modal === 'followers' ? 'Seguidor' : 'Seguindo'}</span>
                </Link>
              ))}
              {(modal === 'followers' ? followers : following).length === 0 && <div>Vazio.</div>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

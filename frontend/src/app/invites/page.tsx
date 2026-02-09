 'use client';
 import React, { useEffect, useState } from 'react';
 import { BASE_URL } from '../../lib/api';
 import Link from 'next/link';
 import Avatar from '../../components/Avatar';
 
 export default function InvitesPage() {
   const [userId, setUserId] = useState<string>('');
   const [received, setReceived] = useState<any[]>([]);
   const [sent, setSent] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [toast, setToast] = useState('');
 
   useEffect(() => {
     const uid = typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';
     setUserId(uid);
   }, []);
 
   useEffect(() => {
     async function load() {
       if (!userId) return;
       setLoading(true);
       setError('');
       try {
         const [rec, snt] = await Promise.all([
           fetch(`${BASE_URL}/api/invites/received/${userId}`).then(r => r.json()),
           fetch(`${BASE_URL}/api/invites/sent/${userId}`).then(r => r.json())
         ]);
         setReceived(rec || []);
         setSent(snt || []);
       } catch {
         setError('Falha ao carregar convites');
       } finally {
         setLoading(false);
       }
     }
     load();
   }, [userId]);
 
   async function accept(id: number) {
     try {
       const r = await fetch(`${BASE_URL}/api/invites/${id}/accept`, { method: 'POST' });
       if (!r.ok) throw new Error('Erro ao aceitar');
       setToast('Convite aceito');
       setTimeout(() => setToast(''), 3000);
       const rec = await fetch(`${BASE_URL}/api/invites/received/${userId}`).then(r => r.json());
       setReceived(rec || []);
     } catch {
       setError('Não foi possível aceitar o convite');
     }
   }
 
   async function decline(id: number) {
     try {
       const r = await fetch(`${BASE_URL}/api/invites/${id}/decline`, { method: 'POST' });
       if (!r.ok) throw new Error('Erro ao recusar');
       setToast('Convite recusado');
       setTimeout(() => setToast(''), 3000);
       const rec = await fetch(`${BASE_URL}/api/invites/received/${userId}`).then(r => r.json());
       setReceived(rec || []);
     } catch {
       setError('Não foi possível recusar o convite');
     }
   }
 
   if (!userId) return <main className="card">Entre para ver seus convites.</main>;
 
   return (
     <main className="grid">
       {toast && (
         <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#22c55e', color: '#052e1a', padding: '12px 16px', borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.35)', fontWeight: 600 }}>
           {toast} ✅
         </div>
       )}
       <section className="card">
         <div className="h2">Convites recebidos</div>
         {loading && <div>Carregando...</div>}
         {error && <div style={{ color: 'tomato' }}>{error}</div>}
         <div className="list">
           {received.length === 0 && !loading && <div>Nenhum convite.</div>}
           {received.map((i: any) => (
             <div key={i.id} className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
               <div className="row" style={{ gap: 12 }}>
                 <Avatar src={i.inviter?.avatarUrl} alt={i.inviter?.name} size={28} name={i.inviter?.name} />
                 <div>
                   <div>{i.inviter?.name} convidou você</div>
                   <div className="text-muted">{i.match?.venue?.name} · {new Date(i.match?.startTime).toLocaleString('pt-BR')}</div>
                 </div>
               </div>
               <div className="row" style={{ gap: 8 }}>
                 <button className="btn btn-primary" onClick={() => accept(i.id)}>Aceitar</button>
                 <button className="btn btn-secondary" onClick={() => decline(i.id)}>Recusar</button>
                 <Link className="btn btn-tertiary" href={`/matches/${i.match?.id}`}>Ver partida</Link>
               </div>
             </div>
           ))}
         </div>
       </section>
 
       <section className="card">
         <div className="h2">Convites enviados</div>
         <div className="list">
           {sent.length === 0 && <div>Nenhum convite enviado.</div>}
           {sent.map((i: any) => (
             <div key={i.id} className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
               <div className="row" style={{ gap: 12 }}>
                 <Avatar src={i.invitee?.avatarUrl} alt={i.invitee?.name} size={28} name={i.invitee?.name} />
                 <div>
                   <div>Para {i.invitee?.name}</div>
                   <div className="text-muted">{i.match?.venue?.name} · {new Date(i.match?.startTime).toLocaleString('pt-BR')}</div>
                 </div>
               </div>
               <div className="pill">{i.status}</div>
             </div>
           ))}
         </div>
       </section>
     </main>
   );
 }

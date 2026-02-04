 'use client';
 import React, { useEffect, useState } from 'react';
 import { useParams } from 'next/navigation';
 import { BASE_URL } from '../../../lib/api';
 import Avatar from '../../../components/Avatar';
 
 export default function UserDetailsPage() {
   const params = useParams();
   const [user, setUser] = useState<any | null>(null);
   const [matches, setMatches] = useState<any[]>([]);
 
   useEffect(() => {
     if (params.id) {
       fetch(`${BASE_URL}/api/users/${params.id}`)
         .then(r => r.json())
         .then(setUser)
         .catch(() => setUser(null));
 
       fetch(`${BASE_URL}/api/users/${params.id}/matches`)
         .then(r => r.json())
         .then(setMatches)
         .catch(() => setMatches([]));
     }
   }, [params.id]);
 
   if (!user) return <main className="card">Carregando...</main>;
 
   return (
     <main className="grid">
       <div className="page-header">
         <div className="row">
           <Avatar src={user.avatarUrl} alt={user.name} size={64} name={user.name} />
           <div>
             <div className="h1">{user.name}</div>
             <div className="text-muted">{user.city || ''}</div>
           </div>
         </div>
       </div>
 
       <section className="card">
         <div className="h2">Partidas</div>
         <div className="list">
           {matches.length === 0 && <div>Nenhuma partida.</div>}
           {matches.map(m => (
             <div key={m.id} className="row" style={{ justifyContent: 'space-between' }}>
               <div>
                 <div className="h2">{m.venue?.name} · {m.sportType}</div>
                 <div className="text-muted">{new Date(m.startTime).toLocaleString('pt-BR')}</div>
               </div>
               <a className="btn btn-tertiary" href={`/matches/${m.id}`}>Ver</a>
             </div>
           ))}
         </div>
       </section>
     </main>
   );
 }

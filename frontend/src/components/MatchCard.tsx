 import Link from 'next/link';
 import Avatar from './Avatar';
 
 export default function MatchCard({ match }: { match: any }) {
   const participants = match.participants || [];
   const organizerId = match.organizer?.id ? String(match.organizer.id) : null;
   const hasOrganizerInParticipants = organizerId ? participants.some((u: any) => String(u.id) === organizerId) : false;
   const count = participants.length + (organizerId && !hasOrganizerInParticipants ? 1 : 0);
   return (
     <div className="card card-hover">
       <div className="row" style={{ justifyContent: 'space-between' }}>
         <div style={{ display: 'grid', gap: 6 }}>
           <div className="row" style={{ gap: 8 }}>
             <div className="h2">{match.venue?.name}</div>
             <span className="pill">{match.sportType}</span>
           </div>
          {match.facility && (
            <div className="row" style={{ gap: 8 }}>
              <span className="pill">{match.facility}</span>
            </div>
          )}
           <div className="text-muted">{new Date(match.startTime).toLocaleString('pt-BR')} · {count}/{match.maxPlayers} jogadores</div>
           {match.organizer && (
             <div className="row" style={{ gap: 8 }}>
               <Avatar src={match.organizer.avatarUrl} alt={match.organizer.name} size={24} name={match.organizer.name} />
               <span className="text-muted">{match.organizer.name}</span>
             </div>
           )}
         </div>
         <Link className="btn btn-tertiary" href={`/matches/${match.id}`}>Ver</Link>
       </div>
     </div>
   );
 }

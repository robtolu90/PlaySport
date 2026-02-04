 import Link from 'next/link';
 
 export default function ListCard({ venue }: { venue: any }) {
   return (
     <div className="card card-hover">
       <div className="row" style={{ justifyContent: 'space-between' }}>
         <div>
           <div className="h2">{venue.name}</div>
           <div className="text-muted">{venue.city} · {venue.sportType}</div>
         </div>
         <Link className="btn btn-tertiary" href={`/venues/${venue.id}`}>Ver</Link>
       </div>
     </div>
   );
 }

 import React from 'react';
 
 export default function FilterBar({ defaultCity, defaultSport }: { defaultCity?: string; defaultSport?: string }) {
   return (
     <div className="card" style={{ padding: '16px' }}>
       <div className="h2">Filtros</div>
       <form className="row" action="/venues">
         <input className="input input-sm" name="city" placeholder="Cidade" defaultValue={defaultCity || ''} />
         <select className="input input-sm" name="sport" defaultValue={defaultSport || ''}>
           <option value="">Todos</option>
           <option value="FUTSAL">Futsal</option>
           <option value="BEACH_SOCCER">Beach Soccer</option>
           <option value="SOCCER">Soccer</option>
           <option value="BASKETBALL">Basquete</option>
           <option value="VOLLEYBALL">Vôlei</option>
         </select>
         <button className="btn btn-secondary" type="submit">Buscar</button>
       </form>
     </div>
   );
 }

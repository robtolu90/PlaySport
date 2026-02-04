 'use client';
 import React, { useEffect, useState } from 'react';
 import Link from 'next/link';
 
 export default function PageHeader({ title, description, actionHref, actionLabel }: { title: string; description: string; actionHref: string; actionLabel: string }) {
   const [user, setUser] = useState<{ id: string; name: string; roles: string[] } | null>(null);
   useEffect(() => {
     const id = localStorage.getItem('userId');
     const name = localStorage.getItem('userName');
     const rolesStr = localStorage.getItem('userRoles');
     const roles = rolesStr ? JSON.parse(rolesStr) : [];
     if (id && name) setUser({ id, name, roles });
     else setUser(null);
     const handler = () => {
       const id2 = localStorage.getItem('userId');
       const name2 = localStorage.getItem('userName');
       const rolesStr2 = localStorage.getItem('userRoles');
       const roles2 = rolesStr2 ? JSON.parse(rolesStr2) : [];
       if (id2 && name2) setUser({ id: id2, name: name2, roles: roles2 });
       else setUser(null);
     };
     window.addEventListener('auth-change', handler);
     return () => window.removeEventListener('auth-change', handler);
   }, []);
   const isAdmin = !!user?.roles?.includes('ADMIN');
   return (
     <div className="card" style={{ display: 'grid', gap: '12px' }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
         <div style={{ flex: 1 }}>
           <div className="h1">{title}</div>
           <div className="text-muted">{description}</div>
           <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
             {isAdmin && <Link className="btn btn-primary" href={actionHref as any}>{actionLabel}</Link>}
           </div>
         </div>
       </div>
     </div>
   );
 }

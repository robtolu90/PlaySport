 import React from 'react';
 
 export default function Avatar({ src, alt, size = 32, name }: { src?: string; alt: string; size?: number; name?: string }) {
   const letter = (name || alt || '?').trim().charAt(0).toUpperCase();
   if (src) {
     return <img src={src} alt={alt} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
   }
   return (
     <div style={{
       width: size, height: size, borderRadius: '50%',
       display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
       background: 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(34,197,94,0.05))',
       color: 'var(--fg)', fontWeight: 700, fontSize: Math.round(size * 0.45)
     }}>
       {letter}
     </div>
   );
 }

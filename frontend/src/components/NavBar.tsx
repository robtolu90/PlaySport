'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);

  const checkUser = () => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    if (id && name) setUser({ id, name });
    else setUser(null);
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('auth-change', checkUser);
    return () => window.removeEventListener('auth-change', checkUser);
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  }

  return (
    <nav className="nav">
      <div className="row">
        <Link href="/">PlaySport</Link>
      </div>
      <div className="row" style={{ gap: 16 }}>
        <Link href="/venues">Campos</Link>
        <Link href="/matches">Partidas</Link>
        {user ? (
          <>
            <Link href={'/profile' as any}>Perfil</Link>
            <button className="button" onClick={logout}>Sair</button>
          </>
        ) : (
          <>
            <Link href="/auth/login">Entrar</Link>
            <Link href="/auth/register">Cadastrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}

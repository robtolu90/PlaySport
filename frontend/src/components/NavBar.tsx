'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [user, setUser] = useState<{ id: string; name: string; roles: string[] } | null>(null);

  const checkUser = () => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    const rolesStr = localStorage.getItem('userRoles');
    const roles = rolesStr ? JSON.parse(rolesStr) : [];
    if (id && name) setUser({ id, name, roles });
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
    localStorage.removeItem('userRoles');
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  }

  const isAdmin = user?.roles?.includes('ADMIN');

  return (
    <nav className="nav">
      <div className="row">
        <Link className="brand" href="/">PlaySport</Link>
      </div>
      <div className="actions">
        <Link href="/venues">Campos</Link>
        <Link href="/matches">Partidas</Link>
        {isAdmin && (
          <>
            <Link className="btn btn-primary" href="/venues/new">+ Campo</Link>
            <Link className="btn btn-primary" href="/matches/new">+ Partida</Link>
          </>
        )}
        {user ? (
          <>
            <Link href={'/profile' as any}>Perfil</Link>
            <button className="btn btn-danger" onClick={logout}>Sair</button>
          </>
        ) : (
          <>
            <Link href="/auth/login">Entrar</Link>
            <Link className="btn btn-secondary" href="/auth/register">Cadastrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}

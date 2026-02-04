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
        <Link className="brand" href="/">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.svg" alt="JogaAí" style={{ width: 24, height: 24, borderRadius: 6, objectFit: 'cover' }} />
            JogaAí
          </span>
        </Link>
      </div>
      <div className="actions">
        <Link href="/venues">Campos</Link>
        <Link href="/matches">Partidas</Link>
        {isAdmin && (<Link className="btn btn-primary" href="/venues/new">+ Campo</Link>)}
        {user ? (
          <Dropdown userName={user.name} onLogout={logout} />
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

function Dropdown({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('click', onDocClick);
      document.addEventListener('keydown', onKey);
    }
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button className="btn btn-tertiary" onClick={() => setOpen(v => !v)}>Olá, {userName.split(' ')[0]}</button>
      {open && (
        <div className="dropdown">
          <Link className="btn btn-tertiary" href={'/profile' as any} onClick={() => setOpen(false)}>Perfil</Link>
          <button className="btn btn-danger" onClick={() => { setOpen(false); onLogout(); }}>Sair</button>
        </div>
      )}
    </div>
  );
}

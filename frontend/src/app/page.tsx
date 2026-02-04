import Link from 'next/link';

export default function Home() {
  return (
    <main className="hero">
      <div className="hero-content">
        <div className="display">Reserve campos. Jogue com a sua turma.</div>
        <p className="lead text-muted">PlaySport facilita a reserva de campos e a organização de partidas abertas, com disponibilidade por hora e experiência rápida.</p>
        <div className="cta">
          <Link className="btn btn-primary" href="/venues">Explorar campos</Link>
          <Link className="btn btn-secondary" href="/matches">Ver partidas</Link>
        </div>
        <div className="aux text-muted">
          <span>Já tem conta?</span>
          <Link href="/auth/login">Entrar</Link>
        </div>
      </div>
    </main>
  );
}

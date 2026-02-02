import Link from 'next/link';

export default function Home() {
  return (
    <main className="grid grid-2">
      <section className="card">
        <h2>MVP PlaySport</h2>
        <p>Reservas de campos e partidas abertas.</p>
        <div className="row">
          <Link className="button" href="/venues">Explorar Campos</Link>
          <Link className="button" href="/matches">Ver Partidas</Link>
        </div>
      </section>
      <section className="card">
        <h3>Autenticação</h3>
        <div className="row">
          <Link className="button" href="/auth/login">Entrar</Link>
          <Link className="button" href="/auth/register">Cadastrar</Link>
        </div>
      </section>
    </main>
  );
}

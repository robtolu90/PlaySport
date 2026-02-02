import './globals.css';
import React from 'react';
import NavBar from '../components/NavBar';

export const metadata = {
  title: 'PlaySport',
  description: 'MVP para reserva de campos e partidas abertas'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <div className="container">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}

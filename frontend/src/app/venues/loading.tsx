'use client';
import React from 'react';
import Skeleton from '../../components/ui/Skeleton';

export default function VenuesLoading() {
  return (
    <main className="grid">
      <section className="card">
        <Skeleton style={{ width: 200, height: 28, marginBottom: 12 }} />
        <Skeleton style={{ width: '100%', height: 200 }} />
        <div className="row" style={{ gap: 8, marginTop: 12 }}>
          <Skeleton style={{ width: 120, height: 20 }} />
          <Skeleton style={{ width: 160, height: 20 }} />
          <Skeleton style={{ width: 100, height: 20 }} />
        </div>
      </section>
      <section className="card">
        <Skeleton style={{ width: 160, height: 22, marginBottom: 12 }} />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} style={{ width: '100%', height: 46, borderRadius: 8 }} />
          ))}
        </div>
      </section>
      <section className="card">
        <Skeleton style={{ width: 180, height: 22, marginBottom: 8 }} />
        <div className="list">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="row" style={{ justifyContent: 'space-between' }}>
              <Skeleton style={{ width: 240, height: 18 }} />
              <Skeleton style={{ width: 80, height: 26 }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

'use client';
import React from 'react';
import Skeleton from '../components/ui/Skeleton';

export default function AppLoading() {
  return (
    <main className="grid">
      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton style={{ width: 160, height: 24 }} />
          <div className="row" style={{ gap: 8 }}>
            <Skeleton style={{ width: 80, height: 32 }} />
            <Skeleton style={{ width: 100, height: 32 }} />
          </div>
        </div>
      </section>
      <section className="card">
        <div className="grid" style={{ gap: '1rem' }}>
          <Skeleton style={{ width: '100%', height: 140 }} />
          <Skeleton style={{ width: '100%', height: 140 }} />
          <Skeleton style={{ width: '100%', height: 140 }} />
        </div>
      </section>
      <section className="card">
        <div className="list">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton style={{ width: 260, height: 20 }} />
              <Skeleton style={{ width: 90, height: 28 }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

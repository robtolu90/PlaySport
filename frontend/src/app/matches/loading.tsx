'use client';
import React from 'react';
import Skeleton from '../../components/ui/Skeleton';

export default function MatchesLoading() {
  return (
    <main className="grid">
      <section className="card">
        <Skeleton style={{ width: 180, height: 24, marginBottom: 8 }} />
        <div className="row" style={{ gap: 12 }}>
          <Skeleton style={{ width: 200, height: 18 }} />
          <Skeleton style={{ width: 120, height: 18 }} />
        </div>
        <Skeleton style={{ width: 260, height: 16, marginTop: 10 }} />
      </section>
      <section className="card">
        <Skeleton style={{ width: 160, height: 22, marginBottom: 8 }} />
        <div className="list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="row" style={{ gap: 8 }}>
              <Skeleton style={{ width: 32, height: 32, borderRadius: 999 }} />
              <Skeleton style={{ width: 160, height: 18 }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

'use client';
import React from 'react';
import Skeleton from '../../../components/ui/Skeleton';

export default function MatchDetailLoading() {
  return (
    <main className="grid">
      <section className="card">
        <Skeleton style={{ width: 160, height: 24, marginBottom: 6 }} />
        <Skeleton style={{ width: 240, height: 18, marginBottom: 4 }} />
        <Skeleton style={{ width: 200, height: 16, marginBottom: 8 }} />
        <div className="row" style={{ gap: 8 }}>
          <Skeleton style={{ width: 120, height: 16 }} />
          <Skeleton style={{ width: 90, height: 16 }} />
        </div>
      </section>
      <section className="card">
        <Skeleton style={{ width: 140, height: 22, marginBottom: 8 }} />
        <div className="list">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="row" style={{ gap: 10 }}>
              <Skeleton style={{ width: 32, height: 32, borderRadius: 999 }} />
              <Skeleton style={{ width: 180, height: 18 }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

'use client';
import React from 'react';
import Skeleton from '../../components/ui/Skeleton';

export default function ProfileLoading() {
  return (
    <main className="grid">
      <section className="card" style={{ padding: '24px' }}>
        <div className="row" style={{ gap: 16 }}>
          <Skeleton style={{ width: 72, height: 72, borderRadius: 999 }} />
          <div className="grid" style={{ gap: 8 }}>
            <Skeleton style={{ width: 180, height: 24 }} />
            <Skeleton style={{ width: 220, height: 16 }} />
            <div className="row" style={{ gap: 8 }}>
              <Skeleton style={{ width: 100, height: 24 }} />
              <Skeleton style={{ width: 100, height: 24 }} />
              <Skeleton style={{ width: 100, height: 24 }} />
            </div>
          </div>
        </div>
      </section>
      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <Skeleton style={{ width: 120, height: 22 }} />
          <Skeleton style={{ width: 60, height: 30 }} />
        </div>
        <div className="list" style={{ marginTop: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="row" style={{ gap: 12 }}>
              <Skeleton style={{ width: 24, height: 24, borderRadius: 6 }} />
              <Skeleton style={{ width: 220, height: 16 }} />
            </div>
          ))}
        </div>
      </section>
      <section className="card">
        <Skeleton style={{ width: 160, height: 22, marginBottom: 8 }} />
        <div className="grid" style={{ gap: '1rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} style={{ width: '100%', height: 120 }} />
          ))}
        </div>
      </section>
    </main>
  );
}

'use client';
import React from 'react';
import Skeleton from '../../components/ui/Skeleton';

export default function InvitesLoading() {
  return (
    <main className="grid">
      <section className="card">
        <Skeleton style={{ width: 200, height: 24, marginBottom: 8 }} />
        <div className="list">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="row" style={{ gap: 12 }}>
                <Skeleton style={{ width: 28, height: 28, borderRadius: 999 }} />
                <Skeleton style={{ width: 220, height: 18 }} />
              </div>
              <div className="row" style={{ gap: 8 }}>
                <Skeleton style={{ width: 80, height: 28 }} />
                <Skeleton style={{ width: 80, height: 28 }} />
                <Skeleton style={{ width: 90, height: 28 }} />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="card">
        <Skeleton style={{ width: 200, height: 24, marginBottom: 8 }} />
        <div className="list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="row" style={{ gap: 12 }}>
                <Skeleton style={{ width: 28, height: 28, borderRadius: 999 }} />
                <Skeleton style={{ width: 220, height: 18 }} />
              </div>
              <Skeleton style={{ width: 90, height: 28 }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

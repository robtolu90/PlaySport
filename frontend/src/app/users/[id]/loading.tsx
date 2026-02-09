'use client';
import React from 'react';
import Skeleton from '../../../components/ui/Skeleton';

export default function UserProfileLoading() {
  return (
    <main className="grid">
      <section className="card">
        <div className="row" style={{ gap: 12 }}>
          <Skeleton style={{ width: 64, height: 64, borderRadius: 999 }} />
          <div className="grid" style={{ gap: 8 }}>
            <Skeleton style={{ width: 160, height: 22 }} />
            <Skeleton style={{ width: 120, height: 16 }} />
          </div>
          <Skeleton style={{ width: 100, height: 32, marginLeft: 'auto' }} />
        </div>
      </section>
      <section className="card">
        <Skeleton style={{ width: 160, height: 22, marginBottom: 8 }} />
        <div className="list">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="row" style={{ justifyContent: 'space-between' }}>
              <Skeleton style={{ width: 240, height: 18 }} />
              <Skeleton style={{ width: 90, height: 28 }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

 'use client';
 import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BASE_URL } from '../../../lib/api';
import Avatar from '../../../components/Avatar';
import SecondaryButton from '../../../components/SecondaryButton';
import Skeleton from '../../../components/ui/Skeleton';

export default function UserDetailsPage() {
  const params = useParams();
  const [user, setUser] = useState<any | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [followError, setFollowError] = useState('');

  useEffect(() => {
    // Get viewer ID from localStorage (client-side only)
    const storedId = localStorage.getItem('userId');
    setViewerId(storedId);

    if (params.id) {
      fetch(`${BASE_URL}/api/users/${params.id}`)
        .then(r => r.json())
        .then(setUser)
        .catch(() => setUser(null));

      fetch(`${BASE_URL}/api/users/${params.id}/matches`)
        .then(r => r.json())
        .then(setMatches)
        .catch(() => setMatches([]));
    }
  }, [params.id]);

  useEffect(() => {
    if (viewerId && user && viewerId !== String(user.id)) {
      // Check if viewer is following this user
      fetch(`${BASE_URL}/api/social/following/${viewerId}`)
        .then(r => r.json())
        .then((followingList: any[]) => {
          const isFound = followingList.some(u => String(u.id) === String(user.id));
          setIsFollowing(isFound);
        })
        .catch(err => console.error('Error fetching following status:', err));
    }
  }, [viewerId, user]);

  const handleFollowToggle = async () => {
    if (!viewerId || !user) return;
    
    setIsLoadingFollow(true);
    setFollowError('');

    try {
      if (isFollowing) {
        // Unfollow
        const res = await fetch(`${BASE_URL}/api/social/follow?followerId=${viewerId}&followeeId=${user.id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to unfollow');
        setIsFollowing(false);
      } else {
        // Follow
        const res = await fetch(`${BASE_URL}/api/social/follow?followerId=${viewerId}&followeeId=${user.id}`, {
          method: 'POST',
        });
        if (!res.ok) throw new Error('Failed to follow');
        setIsFollowing(true);
      }
    } catch (err) {
      setFollowError('Action failed. Please try again.');
      setTimeout(() => setFollowError(''), 3000);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  if (!user) return (
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

  return (
    <main className="grid">
      {followError && (
        <div style={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24, 
          background: '#ef4444', 
          color: 'white', 
          padding: '12px 24px', 
          borderRadius: '8px', 
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {followError}
        </div>
      )}
      
      <div className="page-header">
        <div className="row">
          <Avatar src={user.avatarUrl} alt={user.name} size={64} name={user.name} />
          <div>
            <div className="row">
              <div className="h1">{user.name}</div>
              {viewerId && String(viewerId) !== String(user.id) && (
                <SecondaryButton 
                  onClick={handleFollowToggle} 
                  disabled={isLoadingFollow}
                >
                  {isLoadingFollow ? 'Loading...' : (isFollowing ? 'Following' : 'Follow')}
                </SecondaryButton>
              )}
            </div>
            <div className="text-muted">{user.city || ''}</div>
          </div>
        </div>
      </div>
 
       <section className="card">
         <div className="h2">Partidas</div>
         <div className="list">
           {matches.length === 0 && <div>Nenhuma partida.</div>}
           {matches.map(m => (
             <div key={m.id} className="row" style={{ justifyContent: 'space-between' }}>
               <div>
                 <div className="h2">{m.venue?.name} · {m.sportType}</div>
                 <div className="text-muted">{new Date(m.startTime).toLocaleString('pt-BR')}</div>
               </div>
               <a className="btn btn-tertiary" href={`/matches/${m.id}`}>Ver</a>
             </div>
           ))}
         </div>
       </section>
     </main>
   );
 }

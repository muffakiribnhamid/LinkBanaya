import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './PublicProfile.css';

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(`profile_${username}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setProfile(parsed);
      // increment view count
      const updated = { ...parsed, analytics: { ...parsed.analytics, views: (parsed.analytics?.views || 0) + 1 } };
      localStorage.setItem(`profile_${username}`, JSON.stringify(updated));
    }
  }, [username]);

  if (!profile) {
    return <p style={{ padding: '2rem' }}>Profile not found 😢</p>;
  }

  const clickLink = (index, url) => {
    const newProfile = { ...profile };
    newProfile.links[index].clicks = (newProfile.links[index].clicks || 0) + 1;
    newProfile.analytics.clicks = (newProfile.analytics.clicks || 0) + 1;
    setProfile(newProfile);
    localStorage.setItem(`profile_${username}`, JSON.stringify(newProfile));
    window.open(url, '_blank');
  };



  return (
    <div className={`public-page theme-${profile.theme}`}>      
      <h1>@{username}</h1>
      <ul>
        {profile.links.map((l, i) => (
          <li key={l.id}>
            <button className="btn glow-btn" onClick={() => clickLink(i, l.url)}>{l.title || l.url}</button>
          </li>
        ))}
      </ul>
      <footer>Made by Muffakir for HackClub</footer>
    </div>
  );
}

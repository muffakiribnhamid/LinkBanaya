import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { QRCodeSVG } from 'qrcode.react';
import presets from '../data/templates.js';
import './BuilderPage.css';

// Helper to reorder result after drag
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function BuilderPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState('sunset');
  const [links, setLinks] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [analytics, setAnalytics] = useState({ views: 0, clicks: 0 });

  // Load from localStorage if returning user
  useEffect(() => {
    const saved = localStorage.getItem(`profile_${username}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setTheme(parsed.theme);
      setLinks(parsed.links || []);
      setAnalytics(parsed.analytics || { views: 0, clicks: 0 });
    }
  }, [username]);

  // Persist on change
  useEffect(() => {
    if (!username) return;
    localStorage.setItem(
      `profile_${username}`,
      JSON.stringify({ username, theme, links, analytics }),
    );
  }, [username, theme, links, analytics]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newLinks = reorder(
      links,
      result.source.index,
      result.destination.index,
    );
    setLinks(newLinks);
  };

  const addLink = () => {
    setLinks([...links, { id: Date.now().toString(), title: '', url: '', clicks: 0 }]);
  };

  const updateLink = (id, field, value) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const applyPreset = (preset) => {
    setTheme(preset.theme);
    setLinks(preset.links.map((l) => ({ ...l, id: Date.now().toString() + Math.random() })));
  };

  const shareUrl = `${window.location.origin}/${username || 'yourname'}`;

  const goToPublic = () => {
    if (!username) return alert('Pick a username first');
    navigate(`/${username}`);
  };

  return (
    <div className={`builder theme-${theme}`}>
      <h1>Link-in-Bio Builder</h1>
      <label>
        Username 
        <input value={username} onChange={(e) => setUsername(e.target.value.trim())} placeholder="coolkid" />
      </label>

      <section className="section">
        <h2>Pick a theme </h2>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          {['rainbow', 'sunset', 'mint', 'space'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </section>

      <section className="section">
        <h2>Links </h2>
        <button className="btn glow-btn" onClick={addLink}>Add Link</button>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <ul ref={provided.innerRef} {...provided.droppableProps}>
                {links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(prov) => (
                      <li ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                        <input
                          placeholder="Title"
                          value={link.title}
                          onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                        />
                        <input
                          placeholder="https://example.com"
                          value={link.url}
                          onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        />
                        <span className="small">clicks: {link.clicks}</span>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </section>

      <section className="section">
        <h2>Presets </h2>
        <div className="preset-list">
          {presets.map((p) => (
            <button className="btn" key={p.name} onClick={() => applyPreset(p)}>{p.name}</button>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Analytics </h2>
        <p>Views: {analytics.views} | Total Clicks: {analytics.clicks}</p>
      </section>

      <section className="section actions">
        <button className="btn glow-btn" onClick={() => setShowQR((s) => !s)}>QR Code</button>
        <button className="btn glow-btn" onClick={goToPublic}>Open Public Page</button>
        <p className="small">Share URL: {shareUrl}</p>
      </section>

      {showQR && (
        <div className="qr-overlay" onClick={() => setShowQR(false)}>
          <QRCodeSVG value={shareUrl} size={200} />
        </div>
      )}
          <footer className="footer small mt">Made by Muffakir for HackClub</footer>
    </div>
  );
}

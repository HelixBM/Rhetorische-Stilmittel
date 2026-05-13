import React, { useMemo, useState } from 'react';

export default function GlossaryMode({ data, onStartChallenge }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  const filtered = useMemo(() => data
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.definition.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name)), [data, search]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const shareChallenge = async () => {
    const link = `${window.location.origin}${window.location.pathname}?challenge=${btoa(JSON.stringify(selected))}`;
    await navigator.clipboard?.writeText(link);
  };

  return (
    <div className="card-area wide-area">
      <div className="card toolbar-card">
        <h2 className="section-title">Herausforderung erstellen</h2>
        <p className="muted-text">Stilmittel auswählen, direkt starten oder einen Link für die Klasse kopieren.</p>
        <div className="btn-row compact-actions">
          <button className="btn btn-primary" disabled={selected.length === 0} onClick={() => onStartChallenge(data.filter(d => selected.includes(d.id)))}>
            Start ({selected.length})
          </button>
          <button className="btn btn-ghost" disabled={selected.length === 0} onClick={shareChallenge}>
            Link kopieren
          </button>
        </div>
      </div>

      <label className="sr-only" htmlFor="glossary-search">Glossar durchsuchen</label>
      <input
        id="glossary-search"
        type="text"
        className="ft-input search-input"
        placeholder="Suchen nach Stilmittel oder Definition"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="glossary-list">
        {filtered.map(s => (
          <article
            key={s.id}
            className={`card glossary-card ${selected.includes(s.id) ? 'selected-card' : ''}`}
          >
            <div className="glossary-card-header">
              <div>
                <h3>{s.name}</h3>
                <p className="muted-text">{s.definition}</p>
              </div>
              <button
                className={`btn ${selected.includes(s.id) ? 'btn-primary' : 'btn-ghost'} compact-btn`}
                onClick={() => toggleSelect(s.id)}
                aria-pressed={selected.includes(s.id)}
              >
                {selected.includes(s.id) ? 'Ausgewählt' : 'Auswählen'}
              </button>
            </div>
            <div className="flashcard-examples">
              {s.examples.map((ex, i) => <span key={i}>{ex}</span>)}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

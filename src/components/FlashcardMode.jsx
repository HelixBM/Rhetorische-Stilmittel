import React, { useState } from 'react';
import { shuffle } from '../lib/quiz';

export default function FlashcardMode({ data }) {
  const [deck, setDeck] = useState(() => shuffle(data));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const current = deck[idx];
  const total = deck.length;

  const next = () => {
    setFlipped(false);
    setTimeout(() => setIdx(i => (i + 1 < total ? i + 1 : i)), 100);
  };
  const prev = () => {
    setFlipped(false);
    setTimeout(() => setIdx(i => (i - 1 >= 0 ? i - 1 : i)), 100);
  };
  const restart = () => {
    setDeck(shuffle(data));
    setIdx(0);
    setFlipped(false);
  };

  if (!current) return <div className="card">Keine Daten verfügbar.</div>;

  return (
    <div className="card-area">
      <div className="card">
        <div className="progress-bar-track" aria-hidden="true">
          <div className="progress-bar-fill" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <div className="card-counter">{idx + 1} / {total}</div>
        {!flipped ? (
          <button className="flashcard-front flashcard-button" onClick={() => setFlipped(true)} aria-label={`${current.name} aufdecken`}>
            <span className="flashcard-name">{current.name}</span>
            <span className="flashcard-hint">Aufdecken</span>
          </button>
        ) : (
          <div className="flashcard-back">
            <div className="flashcard-name flashcard-back-title">{current.name}</div>
            <div className="flashcard-def">{current.definition}</div>
            <div className="flashcard-example-label">Beispiele</div>
            <div className="flashcard-examples">
              {current.examples.slice(0, 4).map((ex, i) => <span key={i}>{ex}</span>)}
            </div>
          </div>
        )}
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={prev} disabled={idx === 0}>Zurück</button>
          {idx === total - 1
            ? <button className="btn btn-primary" onClick={restart}>Neu mischen</button>
            : <button className="btn btn-primary" onClick={next}>Weiter</button>}
        </div>
      </div>
    </div>
  );
}

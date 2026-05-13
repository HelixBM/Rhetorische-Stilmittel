import React from 'react';
import { buildResultSummary } from '../lib/quiz';

export function QuizSettings({ questionCount, onQuestionCountChange, onRestart }) {
  return (
    <div className="quiz-settings" aria-label="Quiz-Einstellungen">
      <label className="settings-label" htmlFor="question-count">Fragen</label>
      <select id="question-count" className="ft-input settings-select" value={questionCount} onChange={onQuestionCountChange}>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
      </select>
      <button className="btn btn-ghost compact-btn" onClick={onRestart}>Neu starten</button>
    </div>
  );
}

export function QuizProgress({ qIdx, total }) {
  return (
    <>
      <div className="progress-bar-track" aria-hidden="true">
        <div className="progress-bar-fill" style={{ width: `${((qIdx + 1) / total) * 100}%` }} />
      </div>
      <div className="card-counter">Frage {qIdx + 1} / {total}</div>
    </>
  );
}

export function Explanation({ item }) {
  if (!item) return null;
  return (
    <div className="explanation">
      <strong>Erklärung:</strong> {item.definition}
      {item.examples?.[0] && <span className="explanation-example"> Beispiel: {item.examples[0]}</span>}
    </div>
  );
}

export function Results({ score, total, onRestart, modeLabel = 'Quiz' }) {
  const pct = Math.round((score / total) * 100);
  let msg = 'Weiter üben.';
  if (pct >= 90) msg = 'Sehr sicher.';
  else if (pct >= 70) msg = 'Gute Leistung.';
  else if (pct >= 50) msg = 'Solide Grundlage.';

  const copySummary = async () => {
    await navigator.clipboard?.writeText(buildResultSummary({ score, total, modeLabel }));
  };

  return (
    <div className="card-area">
      <div className="card">
        <div className="results" aria-live="polite">
          <div className="results-score">{pct}%</div>
          <div className="results-label">{score} von {total} richtig</div>
          <div className="results-message">{msg}</div>
          <div className="btn-row result-actions">
            <button className="btn btn-primary" onClick={onRestart}>Nochmal spielen</button>
            <button className="btn btn-ghost" onClick={copySummary}>Ergebnis kopieren</button>
          </div>
        </div>
      </div>
    </div>
  );
}

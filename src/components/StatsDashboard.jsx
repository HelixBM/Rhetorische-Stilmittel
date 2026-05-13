import React, { useEffect, useState } from 'react';
import { getAllProgress } from '../db/stats';

export default function StatsDashboard({ data }) {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    getAllProgress().then(setStats);
  }, []);

  const totalPossible = data.length;
  const discovered = stats.length;
  const mastery = stats.filter(s => s.streak >= 5).length;

  return (
    <div className="card-area wide-area">
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="results-label">Entdeckt</div>
          <div className="results-score stat-score">{discovered} / {totalPossible}</div>
        </div>
        <div className="card stat-card">
          <div className="results-label">Meisterhaft</div>
          <div className="results-score stat-score">{mastery}</div>
        </div>
      </div>

      <div className="card spaced-card">
        <h2 className="section-title">Abzeichen</h2>
        <div className="badges-list">
          {discovered >= 10 && <span className="badge">Forscher (10 entdeckt)</span>}
          {discovered >= 30 && <span className="badge">Gelehrter (30 entdeckt)</span>}
          {mastery >= 5 && <span className="badge">Spezialist (5 Meister)</span>}
          {mastery >= 20 && <span className="badge">Rhetorik-Großmeister (20 Meister)</span>}
          {discovered === 0 && <p className="muted-text">Noch keine Abzeichen. Fang an zu üben.</p>}
        </div>
      </div>

      <div className="card table-card">
        <h2 className="section-title table-title">Detail-Übersicht</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Stilmittel</th>
                <th>Level</th>
                <th>Genauigkeit</th>
                <th>Streak</th>
              </tr>
            </thead>
            <tbody>
              {stats.sort((a, b) => b.streak - a.streak).map(s => {
                const name = data.find(d => d.id === s.stilId)?.name || 'Unbekannt';
                const accuracy = s.total ? Math.round((s.correct / s.total) * 100) : 0;
                return (
                  <tr key={s.stilId}>
                    <td>{name}</td>
                    <td><span className="badge quiet-badge">{s.level}</span></td>
                    <td>{accuracy}%</td>
                    <td>{s.streak}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

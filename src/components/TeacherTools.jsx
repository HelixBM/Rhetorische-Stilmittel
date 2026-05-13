import React, { useMemo, useState } from 'react';

function worksheetText(items) {
  const lines = [
    'Arbeitsblatt: Rhetorische Stilmittel',
    '',
    'Ordne die Beispiele dem passenden Stilmittel zu und begründe deine Entscheidung.',
    '',
    ...items.map((item, index) => `${index + 1}. ${item.examples[0] || item.definition}`),
    '',
    'Lösungsvorschlag:',
    ...items.map((item, index) => `${index + 1}. ${item.name} - ${item.definition}`),
  ];
  return lines.join('\n');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default function TeacherTools({ data }) {
  const [count, setCount] = useState(10);
  const items = useMemo(() => data.slice(0, count), [data, count]);
  const text = worksheetText(items);

  const copyWorksheet = async () => {
    await navigator.clipboard?.writeText(text);
  };

  const printWorksheet = () => {
    const html = text
      .split('\n')
      .map(line => line ? `<p>${escapeHtml(line)}</p>` : '<br />')
      .join('');
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>Arbeitsblatt</title><style>body{font-family:Arial,sans-serif;line-height:1.5;padding:32px;max-width:760px;margin:auto}p{margin:0 0 10px}</style></head><body>${html}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="card-area wide-area">
      <div className="card">
        <h2 className="section-title">Lehrer-Werkzeuge</h2>
        <p className="muted-text">Erstelle ein einfaches Arbeitsblatt aus dem festen Stilmittel-Datensatz und kopiere es für Unterrichtsmaterialien.</p>
        <div className="quiz-settings teacher-settings">
          <label className="settings-label" htmlFor="worksheet-count">Aufgaben</label>
          <select id="worksheet-count" className="ft-input settings-select" value={count} onChange={e => setCount(+e.target.value)}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          <button className="btn btn-primary" onClick={copyWorksheet}>Arbeitsblatt kopieren</button>
          <button className="btn btn-ghost" onClick={printWorksheet}>Drucken</button>
        </div>
      </div>
      <pre className="card worksheet-preview">{text}</pre>
    </div>
  );
}

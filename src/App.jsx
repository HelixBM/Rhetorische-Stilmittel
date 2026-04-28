import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initDatabase, getAllStilmittel } from './db/sqlite';
import { getAllProgress, updateProgress, getDueItems } from './db/stats';
import { openDB } from 'idb';

// --- Constants ---
const CUSTOM_SETS_STORE = 'custom-sets';

// --- Utility Functions ---
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(data, count, mode) {
  const qs = [];
  const shuffled = shuffle(data);
  const actualCount = Math.min(count, data.length);
  for (let i = 0; i < actualCount; i++) {
    const correct = shuffled[i];
    const ex = correct.examples[Math.floor(Math.random() * correct.examples.length)];
    
    if (mode === 'mc') {
      const wrongs = shuffle(data.filter(s => s.name !== correct.name)).slice(0, 3);
      const options = shuffle([correct, ...wrongs]);
      qs.push({ id: correct.id, example: ex, correctName: correct.name, options: options.map(o => o.name) });
    } else if (mode === 'ft') {
      qs.push({ id: correct.id, example: ex, correctName: correct.name, definition: correct.definition });
    } else if (mode === 'def') {
      const wrongs = shuffle(data.filter(s => s.name !== correct.name)).slice(0, 3);
      const options = shuffle([correct, ...wrongs]);
      qs.push({ id: correct.id, definition: correct.definition, correctName: correct.name, options: options.map(o => o.name) });
    }
  }
  return qs;
}

// --- Components ---

function FlashcardMode({ data }) {
  const [deck, setDeck] = useState(() => shuffle(data));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const current = deck[idx];
  const total = deck.length;
  const next = () => { setFlipped(false); setTimeout(() => setIdx(i => i + 1 < total ? i + 1 : i), 100); };
  const prev = () => { setFlipped(false); setTimeout(() => setIdx(i => i - 1 >= 0 ? i - 1 : i), 100); };
  const restart = () => { setDeck(shuffle(data)); setIdx(0); setFlipped(false); };

  if (!current) return <div className="card">Keine Daten verfügbar.</div>;

  return (
    <div className="card-area">
      <div className="card">
        <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: ((idx+1)/total*100)+"%" }} /></div>
        <div className="card-counter">{idx+1} / {total}</div>
        {!flipped ? (
          <div className="flashcard-front" onClick={() => setFlipped(true)} style={{ cursor: "pointer" }}>
            <div className="flashcard-name">{current.name}</div>
            <div className="flashcard-hint">Klicken zum Aufdecken ↓</div>
          </div>
        ) : (
          <div className="flashcard-back">
            <div className="flashcard-name" style={{ fontSize: 24, textAlign: "center", marginBottom: 16 }}>{current.name}</div>
            <div className="flashcard-def">{current.definition}</div>
            <div className="flashcard-example-label">Beispiele</div>
            <div className="flashcard-examples">
              {current.examples.slice(0,4).map((ex,i) => <span key={i}>{ex}</span>)}
            </div>
          </div>
        )}
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={prev} disabled={idx===0}>← Zurück</button>
          {idx===total-1 ? <button className="btn btn-primary" onClick={restart}>Neu mischen ↻</button>
            : <button className="btn btn-primary" onClick={next}>Weiter →</button>}
        </div>
      </div>
    </div>
  );
}

function Results({ score, total, onRestart }) {
  const pct = Math.round(score / total * 100);
  let msg = "Weiter üben!";
  if (pct >= 90) msg = "Hervorragend! 🎉";
  else if (pct >= 70) msg = "Sehr gut gemacht! 👍";
  else if (pct >= 50) msg = "Gut, aber da geht noch mehr!";
  return (
    <div className="card-area">
      <div className="card">
        <div className="results">
          <div className="results-score">{pct}%</div>
          <div className="results-label">{score} von {total} richtig</div>
          <div className="results-message">{msg}</div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={onRestart}>Nochmal spielen</button>
        </div>
      </div>
    </div>
  );
}

function QuizSettings({ questionCount, onQuestionCountChange, onRestart }) {
  return (
    <div className="btn-row" style={{ marginTop: 0, marginBottom: 16, justifyContent: 'center', alignItems: 'center' }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-soft)' }}>Fragen:</span>
      <select className="ft-input" style={{ padding: '6px 12px', width: 'auto' }} value={questionCount} onChange={onQuestionCountChange}>
        <option value={5}>5</option><option value={10}>10</option><option value={15}>15</option><option value={20}>20</option><option value={30}>30</option>
      </select>
      <button className="btn btn-ghost" onClick={onRestart} style={{ padding: "6px 14px", fontSize: 13 }}>Neu starten</button>
    </div>
  );
}

function QuizProgress({ qIdx, total }) {
  return (
    <>
      <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: ((qIdx + 1) / total * 100) + "%" }} /></div>
      <div className="card-counter">Frage {qIdx + 1} / {total}</div>
    </>
  );
}

function MultipleChoiceMode({ data }) {
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const start = useCallback(() => {
    setQuestions(generateQuestions(data, questionCount, 'mc'));
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }, [data, questionCount]);

  useEffect(() => { start(); }, [start]);

  if (!questions) return null;
  if (done) return <Results score={score} total={questions.length} onRestart={start} />;

  const q = questions[qIdx];
  const handleSelect = async (name) => { 
    if (selected) return; 
    setSelected(name); 
    const isCorrect = name === q.correctName;
    if (isCorrect) setScore(s => s + 1); 
    if (typeof q.id === 'number') await updateProgress(q.id, isCorrect);
  };
  const nextQ = () => { if (qIdx + 1 >= questions.length) setDone(true); else { setQIdx(i => i + 1); setSelected(null); } };

  return (
    <div className="card-area">
      <QuizSettings questionCount={questionCount} onQuestionCountChange={e => setQuestionCount(+e.target.value)} onRestart={start} />
      <div className="card">
        <QuizProgress qIdx={qIdx} total={questions.length} />
        <div className="mc-example">{q.example}</div>
        <div className="mc-options">
          {q.options.map(name => {
            let cls = "mc-option";
            if (selected) {
              if (name === q.correctName) cls += " mc-correct";
              else if (name === selected && name !== q.correctName) cls += " mc-wrong";
            }
            return <button key={name} className={cls} onClick={() => handleSelect(name)}>{name}</button>;
          })}
        </div>
        {selected && <div className={"feedback " + (selected===q.correctName ? "correct" : "wrong")}>
          {selected===q.correctName ? "Richtig! ✓" : "Leider falsch. Die richtige Antwort ist: " + q.correctName}
        </div>}
        {selected && <div className="btn-row" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-primary" onClick={nextQ}>{qIdx+1>=questions.length ? "Ergebnis anzeigen" : "Nächste Frage →"}</button>
        </div>}
      </div>
    </div>
  );
}

function DefinitionMode({ data }) {
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const start = useCallback(() => {
    setQuestions(generateQuestions(data, questionCount, 'def'));
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }, [data, questionCount]);

  useEffect(() => { start(); }, [start]);

  if (!questions) return null;
  if (done) return <Results score={score} total={questions.length} onRestart={start} />;

  const q = questions[qIdx];
  const handleSelect = async (name) => { 
    if (selected) return; 
    setSelected(name); 
    const isCorrect = name === q.correctName;
    if (isCorrect) setScore(s => s + 1); 
    if (typeof q.id === 'number') await updateProgress(q.id, isCorrect);
  };
  const nextQ = () => { if (qIdx + 1 >= questions.length) setDone(true); else { setQIdx(i => i + 1); setSelected(null); } };

  return (
    <div className="card-area">
      <QuizSettings questionCount={questionCount} onQuestionCountChange={e => setQuestionCount(+e.target.value)} onRestart={start} />
      <div className="card">
        <QuizProgress qIdx={qIdx} total={questions.length} />
        <div className="def-definition">{q.definition}</div>
        <div className="mc-options">
          {q.options.map(name => {
            let cls = "mc-option";
            if (selected) {
              if (name === q.correctName) cls += " mc-correct";
              else if (name === selected && name !== q.correctName) cls += " mc-wrong";
            }
            return <button key={name} className={cls} onClick={() => handleSelect(name)}>{name}</button>;
          })}
        </div>
        {selected && <div className={"feedback " + (selected===q.correctName ? "correct" : "wrong")}>
          {selected===q.correctName ? "Richtig! ✓" : "Leider falsch. Die richtige Antwort ist: " + q.correctName}
        </div>}
        {selected && <div className="btn-row" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-primary" onClick={nextQ}>{qIdx+1>=questions.length ? "Ergebnis anzeigen" : "Nächste Frage →"}</button>
        </div>}
      </div>
    </div>
  );
}

function FreeTextMode({ data }) {
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  const start = useCallback(() => {
    setQuestions(generateQuestions(data, questionCount, 'ft'));
    setQIdx(0);
    setInput("");
    setSubmitted(false);
    setScore(0);
    setDone(false);
  }, [data, questionCount]);

  useEffect(() => { start(); }, [start]);

  const normalize = (s) => s.toLowerCase().trim()
    .replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss")
    .replace(/[^a-z]/g,"");

  const checkAnswer = async () => {
    if (!input.trim()) return;
    const correct = normalize(input) === normalize(questions[qIdx].correctName);
    setIsCorrect(correct); setSubmitted(true);
    if (correct) setScore(s => s + 1);
    if (typeof questions[qIdx].id === 'number') await updateProgress(questions[qIdx].id, correct);
  };

  const nextQ = () => {
    if (qIdx + 1 >= questions.length) setDone(true);
    else { setQIdx(i => i + 1); setInput(""); setSubmitted(false); setTimeout(() => inputRef.current?.focus(), 50); }
  };

  if (!questions) return null;
  if (done) return <Results score={score} total={questions.length} onRestart={start} />;

  const q = questions[qIdx];

  return (
    <div className="card-area">
      <QuizSettings questionCount={questionCount} onQuestionCountChange={e => setQuestionCount(+e.target.value)} onRestart={start} />
      <div className="card">
        <QuizProgress qIdx={qIdx} total={questions.length} />
        <div className="ft-example">{q.example}</div>
        <div className="ft-input-row">
          <input ref={inputRef} className={"ft-input" + (submitted ? (isCorrect ? " ft-correct" : " ft-wrong") : "")}
            type="text" placeholder="Stilmittel eingeben…" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==="Enter" && !submitted) checkAnswer(); if (e.key==="Enter" && submitted) nextQ(); }}
            disabled={submitted} autoFocus />
          {!submitted && <button className="btn btn-primary" onClick={checkAnswer}>Prüfen</button>}
        </div>
        {submitted && <div className={"feedback " + (isCorrect ? "correct" : "wrong")}>
          {isCorrect ? "Richtig! ✓" : <span>Leider falsch. Die richtige Antwort ist: <strong>{q.correctName}</strong><br /><span style={{ fontWeight: 400, opacity: 0.85 }}>{q.definition}</span></span>}
        </div>}
        {submitted && <div className="btn-row" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-primary" onClick={nextQ}>{qIdx+1>=questions.length ? "Ergebnis anzeigen" : "Nächste Frage →"}</button>
        </div>}
      </div>
    </div>
  );
}

function GlossaryMode({ data, onStartChallenge }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const filtered = data.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.definition.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const shareChallenge = () => {
    const link = window.location.origin + window.location.pathname + "?challenge=" + btoa(JSON.stringify(selected));
    navigator.clipboard.writeText(link);
    alert("Herausforderungs-Link in die Zwischenablage kopiert!");
  };

  return (
    <div className="card-area" style={{ maxWidth: 800 }}>
      <div className="card" style={{ marginBottom: 20 }}>
        <p style={{ fontWeight: 600, marginBottom: 10 }}>Herausforderung erstellen (Klassen-Modus):</p>
        <p style={{ fontSize: 14, color: 'var(--text-soft)', marginBottom: 16 }}>Wähle Stilmittel aus der Liste aus und starte dann den Quiz-Modus oder teile den Link mit Schülern.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" disabled={selected.length === 0} onClick={() => onStartChallenge(data.filter(d => selected.includes(d.id)))}>
            Start ({selected.length})
          </button>
          <button className="btn btn-ghost" disabled={selected.length === 0} onClick={shareChallenge}>
            Link kopieren 🔗
          </button>
        </div>
      </div>

      <input type="text" className="ft-input" placeholder="Suchen nach Stilmittel oder Definition..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 20 }} />
      <div className="glossary-list">
        {filtered.map(s => (
          <div key={s.id} className={"card " + (selected.includes(s.id) ? "selected-card" : "")} 
               onClick={() => toggleSelect(s.id)}
               style={{ marginBottom: 16, cursor: 'pointer', border: selected.includes(s.id) ? '2px solid var(--accent)' : '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: 8 }}>{s.name}</h3>
            <p style={{ color: 'var(--text-soft)', fontSize: 15, marginBottom: 12 }}>{s.definition}</p>
            <div className="flashcard-examples">
              {s.examples.map((ex, i) => <span key={i}>{ex}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsDashboard({ data }) {
  const [stats, setStats] = useState([]);
  useEffect(() => {
    getAllProgress().then(setStats);
  }, []);

  const totalPossible = data.length;
  const discovered = stats.length;
  const mastery = stats.filter(s => s.streak >= 5).length;

  return (
    <div className="card-area" style={{ maxWidth: 800 }}>
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="results-label">Entdeckt</div>
          <div className="results-score" style={{ fontSize: 32 }}>{discovered} / {totalPossible}</div>
        </div>
        <div className="card stat-card">
          <div className="results-label">Meisterhaft</div>
          <div className="results-score" style={{ fontSize: 32 }}>{mastery}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Deine Abzeichen</h3>
        <div className="badges-list" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {discovered >= 10 && <span className="badge">Forscher (10 entdeckt)</span>}
          {discovered >= 30 && <span className="badge">Gelehrter (30 entdeckt)</span>}
          {mastery >= 5 && <span className="badge">Spezialist (5 Meister)</span>}
          {mastery >= 20 && <span className="badge">Rhetorik-Großmeister (20 Meister)</span>}
          {discovered === 0 && <p style={{ fontSize: 14, color: 'var(--text-soft)' }}>Noch keine Abzeichen. Fang an zu üben!</p>}
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, padding: 0 }}>
        <h3 style={{ padding: '24px 24px 12px' }}>Detail-Übersicht</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                <th style={{ padding: '12px 24px', fontSize: 13, color: 'var(--text-soft)' }}>Stilmittel</th>
                <th style={{ padding: '12px 24px', fontSize: 13, color: 'var(--text-soft)' }}>Level</th>
                <th style={{ padding: '12px 24px', fontSize: 13, color: 'var(--text-soft)' }}>Genauigkeit</th>
                <th style={{ padding: '12px 24px', fontSize: 13, color: 'var(--text-soft)' }}>Streak</th>
              </tr>
            </thead>
            <tbody>
              {stats.sort((a,b) => b.streak - a.streak).map(s => {
                const name = data.find(d => d.id === s.stilId)?.name || "Unbekannt";
                return (
                  <tr key={s.stilId} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 600 }}>{name}</td>
                    <td style={{ padding: '16px 24px' }}><span className="badge" style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-soft)' }}>{s.level}</span></td>
                    <td style={{ padding: '16px 24px' }}>{Math.round(s.correct / s.total * 100)}%</td>
                    <td style={{ padding: '16px 24px' }}>{s.streak}</td>
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

function CustomSetsMode({ onSelectSet }) {
  const [sets, setSets] = useState([]);
  
  const loadSets = useCallback(async () => {
    const db = await openDB('custom-sets-db', 1, {
      upgrade(db) { db.createObjectStore(CUSTOM_SETS_STORE, { keyPath: 'id', autoIncrement: true }); }
    });
    const allSets = await db.getAll(CUSTOM_SETS_STORE);
    setSets(allSets);
  }, []);

  useEffect(() => { loadSets(); }, [loadSets]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      if (Array.isArray(json)) {
        const db = await openDB('custom-sets-db', 1);
        await db.add(CUSTOM_SETS_STORE, { name: file.name, data: json });
        loadSets();
      }
    } catch (err) { alert("Fehler beim Laden der Datei. Muss ein JSON-Array sein."); }
  };

  const deleteSet = async (id) => {
    const db = await openDB('custom-sets-db', 1);
    await db.delete(CUSTOM_SETS_STORE, id);
    loadSets();
  };

  return (
    <div className="card-area">
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Eigene Sets</h3>
        <p style={{ fontSize: 14, color: 'var(--text-soft)', margin: '12px 0 20px' }}>Lade eigene Stilmittel-Listen (JSON) hoch, um sie in der App zu nutzen.</p>
        <input type="file" accept=".json" onChange={handleFileUpload} id="file-upload" style={{ display: 'none' }} />
        <label htmlFor="file-upload" className="btn btn-primary" style={{ cursor: 'pointer' }}>Datei hochladen</label>
      </div>
      
      {sets.map(set => (
        <div key={set.id} className="card" style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{set.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{set.data.length} Einträge</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => onSelectSet(set.data)}>Nutzen</button>
            <button className="btn btn-ghost" style={{ padding: '8px 16px', color: 'var(--wrong)', borderColor: 'var(--wrong-bg)' }} onClick={() => deleteSet(set.id)}>Löschen</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Main App ---

function App() {
  const [data, setData] = useState(null);
  const [activeData, setActiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("flash");
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const db = await initDatabase();
        const stilmittel = getAllStilmittel(db);
        setData(stilmittel);
        setActiveData(stilmittel);
        
        const urlParams = new URLSearchParams(window.location.search);
        const challengeData = urlParams.get('challenge');
        if (challengeData) {
          try {
            const ids = JSON.parse(atob(challengeData));
            const challengeItems = stilmittel.filter(s => ids.includes(s.id));
            if (challengeItems.length > 0) {
              setChallenge(challengeItems);
              setMode("challenge");
            }
          } catch (e) { console.error("Invalid challenge link", e); }
        }
      } catch (err) {
        console.error("Failed to load database:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  if (loading) return <div className="app"><div className="nav-header"><h1>Lädt...</h1></div></div>;

  const resetToMain = () => { setActiveData(data); setMode("flash"); };

  return (
    <div className="app">
      <div className="nav-header">
        <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? "HELL" : "DUNKEL"}
        </button>
        <h1>Rhetorische Stilmittel</h1>
        <p>{activeData?.length || 0} Stilmittel · Übungsapp</p>
        <div className="mode-tabs">
          <button className={"mode-tab" + (mode==="flash" ? " active" : "")} onClick={() => setMode("flash")}>Karteikarten</button>
          <button className={"mode-tab" + (mode==="mc" ? " active" : "")} onClick={() => setMode("mc")}>Multiple Choice</button>
          <button className={"mode-tab" + (mode==="def" ? " active" : "")} onClick={() => setMode("def")}>Definitionen</button>
          <button className={"mode-tab" + (mode==="ft" ? " active" : "")} onClick={() => setMode("ft")}>Freitext</button>
          <button className={"mode-tab" + (mode==="glossary" ? " active" : "")} onClick={() => setMode("glossary")}>Glossar</button>
          <button className={"mode-tab" + (mode==="stats" ? " active" : "")} onClick={() => setMode("stats")}>Stats</button>
          <button className={"mode-tab" + (mode==="srs" ? " active" : "")} onClick={() => setMode("srs")}>Review (SRS)</button>
          <button className={"mode-tab" + (mode==="custom" ? " active" : "")} onClick={() => setMode("custom")}>Eigene Sets</button>
        </div>
      </div>
      
      {activeData !== data && mode !== "custom" && (
        <div style={{ marginBottom: 20 }}>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 12px' }} onClick={resetToMain}>← Zurück zum Haupt-Set</button>
        </div>
      )}

      {mode === "flash" && activeData && <FlashcardMode data={activeData} key="flash" />}
      {mode === "mc" && activeData && <MultipleChoiceMode data={activeData} key="mc" />}
      {mode === "def" && activeData && <DefinitionMode data={activeData} key="def" />}
      {mode === "ft" && activeData && <FreeTextMode data={activeData} key="ft" />}
      {mode === "glossary" && activeData && <GlossaryMode data={activeData} onStartChallenge={(items) => { setChallenge(items); setMode("challenge"); }} key="glossary" />}
      {mode === "stats" && data && <StatsDashboard data={data} key="stats" />}
      {mode === "srs" && data && <SRSReviewMode data={data} key="srs" />}
      {mode === "custom" && <CustomSetsMode onSelectSet={(set) => { setActiveData(set); setMode("flash"); }} />}
      {mode === "challenge" && challenge && (
        <div className="challenge-mode">
          <div className="card" style={{ marginBottom: 20, textAlign: 'center', background: 'var(--accent-light)', color: 'var(--accent)', padding: '16px' }}>
            <strong>Herausforderung aktiv!</strong> ({challenge.length} Stilmittel)
            <button className="btn btn-ghost" style={{ marginLeft: 14, padding: '4px 12px', fontSize: 12 }} onClick={resetToMain}>Beenden</button>
          </div>
          <MultipleChoiceMode data={challenge} />
        </div>
      )}
    </div>
  );
}

function SRSReviewMode({ data }) {
  const [dueItems, setDueItems] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getDueItems(data).then(items => { setDueItems(items); setLoading(false); });
  }, [data]);

  if (loading) return <div className="card-area"><div className="card">Suche fällige Aufgaben...</div></div>;
  if (!dueItems || dueItems.length === 0) return (
    <div className="card-area">
      <div className="card" style={{ textAlign: 'center' }}>
        <h3>Alles erledigt! 🎉</h3>
        <p style={{ marginTop: 12 }}>Du hast momentan keine fälligen Wiederholungen. Komm später wieder oder übe in einem anderen Modus!</p>
      </div>
    </div>
  );
  return (
    <div className="srs-review">
      <p style={{ textAlign: 'center', marginBottom: 16, fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{dueItems.length} fällige Wiederholungen</p>
      <MultipleChoiceMode data={dueItems} />
    </div>
  );
}

export default App;

﻿const { useState, useEffect, useRef, useCallback } = React;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(count, mode) {
  const qs = [];
  const shuffled = shuffle(STILMITTEL);
  for (let i = 0; i < count; i++) {
    const correct = shuffled[i % shuffled.length];
    const ex = correct.examples[Math.floor(Math.random() * correct.examples.length)];
    
    if (mode === 'mc') {
      const wrongs = shuffle(STILMITTEL.filter(s => s.name !== correct.name)).slice(0, 3);
      const options = shuffle([correct, ...wrongs]);
      qs.push({ example: ex, correctName: correct.name, options: options.map(o => o.name) });
    } else if (mode === 'ft') {
      qs.push({ example: ex, correctName: correct.name, definition: correct.definition });
    } else if (mode === 'def') {
      const wrongs = shuffle(STILMITTEL.filter(s => s.name !== correct.name)).slice(0, 3);
      const options = shuffle([correct, ...wrongs]);
      qs.push({ definition: correct.definition, correctName: correct.name, options: options.map(o => o.name) });
    }
  }
  return qs;
}


function FlashcardMode() {
  const [deck, setDeck] = useState(() => shuffle(STILMITTEL));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const current = deck[idx];
  const total = deck.length;
  const next = () => { setFlipped(false); setTimeout(() => setIdx(i => i + 1 < total ? i + 1 : i), 100); };
  const prev = () => { setFlipped(false); setTimeout(() => setIdx(i => i - 1 >= 0 ? i - 1 : i), 100); };
  const restart = () => { setDeck(shuffle(STILMITTEL)); setIdx(0); setFlipped(false); };

  return (
    <div className="card-area fade-in">
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
  if (pct >= 90) msg = "Hervorragend! 🥳";
  else if (pct >= 70) msg = "Sehr gut gemacht! 👍";
  else if (pct >= 50) msg = "Gut, aber da geht noch mehr!";
  return (
    <div className="card-area fade-in">
      <div className="card">
        <div className="results">
          <div className="results-score">{pct}%</div>
          <div className="results-label">{score} von {total} richtig</div>
          <div className="results-message">{msg}</div>
          <button className="btn btn-primary" onClick={onRestart}>Nochmal spielen</button>
        </div>
      </div>
    </div>
  );
}

function QuizSettings({ questionCount, onQuestionCountChange, onRestart }) {
  return (
    <div className="settings-row">
      <span className="setting-label">Fragen:</span>
      <select className="setting-select" value={questionCount} onChange={onQuestionCountChange}>
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

function MultipleChoiceMode() {
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const start = useCallback(() => {
    setQuestions(generateQuestions(questionCount, 'mc'));
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }, [questionCount]);

  useEffect(() => { start(); }, [start]);

  if (!questions) return null;
  if (done) return <Results score={score} total={questions.length} onRestart={start} />;

  const q = questions[qIdx];
  const handleSelect = (name) => { if (selected) return; setSelected(name); if (name === q.correctName) setScore(s => s + 1); };
  const nextQ = () => { if (qIdx + 1 >= questions.length) setDone(true); else { setQIdx(i => i + 1); setSelected(null); } };

  return (
    <div className="card-area fade-in">
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

function DefinitionMode() {
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const start = useCallback(() => {
    setQuestions(generateQuestions(questionCount, 'def'));
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }, [questionCount]);

  useEffect(() => { start(); }, [start]);

  if (!questions) return null;
  if (done) return <Results score={score} total={questions.length} onRestart={start} />;

  const q = questions[qIdx];
  const handleSelect = (name) => { if (selected) return; setSelected(name); if (name === q.correctName) setScore(s => s + 1); };
  const nextQ = () => { if (qIdx + 1 >= questions.length) setDone(true); else { setQIdx(i => i + 1); setSelected(null); } };

  return (
    <div className="card-area fade-in">
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

function FreeTextMode() {
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
    setQuestions(generateQuestions(questionCount, 'ft'));
    setQIdx(0);
    setInput("");
    setSubmitted(false);
    setScore(0);
    setDone(false);
  }, [questionCount]);

  useEffect(() => { start(); }, [start]);

  const normalize = (s) => s.toLowerCase().trim()
    .replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss")
    .replace(/[^a-z]/g,"");

  const checkAnswer = () => {
    if (!input.trim()) return;
    const correct = normalize(input) === normalize(questions[qIdx].correctName);
    setIsCorrect(correct); setSubmitted(true);
    if (correct) setScore(s => s + 1);
  };

  const nextQ = () => {
    if (qIdx + 1 >= questions.length) setDone(true);
    else { setQIdx(i => i + 1); setInput(""); setSubmitted(false); setTimeout(() => inputRef.current?.focus(), 50); }
  };

  if (!questions) return null;
  if (done) return <Results score={score} total={questions.length} onRestart={start} />;

  const q = questions[qIdx];

  return (
    <div className="card-area fade-in">
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

function App() {
  const [mode, setMode] = useState("flash");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for saved preference in localStorage, default to false (light mode)
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    // Save preference to localStorage and add/remove class on body
    localStorage.setItem('darkMode', isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="app">
      <div className="nav-header">
        <button
          className="theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle light/dark mode"
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          )}
        </button>
        <h1>Rhetorische Stilmittel</h1>
        <p>{STILMITTEL.length} Stilmittel · Vier Übungsmodi</p>
        <div className="mode-tabs">
          <button className={"mode-tab" + (mode==="flash" ? " active" : "")} onClick={() => setMode("flash")}>Karteikarten</button>
          <button className={"mode-tab" + (mode==="mc" ? " active" : "")} onClick={() => setMode("mc")}>Multiple Choice</button>
          <button className={"mode-tab" + (mode==="def" ? " active" : "")} onClick={() => setMode("def")}>Definitionen</button>
          <button className={"mode-tab" + (mode==="ft" ? " active" : "")} onClick={() => setMode("ft")}>Freitext</button>
        </div>
      </div>
      {mode === "flash" && <FlashcardMode key="flash" />}
      {mode === "mc" && <MultipleChoiceMode key="mc" />}
      {mode === "def" && <DefinitionMode key="def" />}
      {mode === "ft" && <FreeTextMode key="ft" />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

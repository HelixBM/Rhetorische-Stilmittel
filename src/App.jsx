import React, { useEffect, useMemo, useState } from 'react';
import FlashcardMode from './components/FlashcardMode';
import GlossaryMode from './components/GlossaryMode';
import { DefinitionMode, FreeTextMode, MultipleChoiceMode } from './components/QuizModes';
import SRSReviewMode from './components/SRSReviewMode';
import StatsDashboard from './components/StatsDashboard';
import TeacherTools from './components/TeacherTools';
import { getStaticStilmittel } from './lib/data';

const MODES = [
  ['flash', 'Karteikarten'],
  ['mc', 'Multiple Choice'],
  ['def', 'Definitionen'],
  ['ft', 'Freitext'],
  ['glossary', 'Glossar'],
  ['stats', 'Stats'],
  ['srs', 'Review'],
  ['teacher', 'Lehrer'],
];

function App() {
  const data = useMemo(() => getStaticStilmittel(), []);
  const [mode, setMode] = useState('flash');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeData = urlParams.get('challenge');
    if (!challengeData) return;

    try {
      const ids = JSON.parse(atob(challengeData));
      const challengeItems = data.filter(s => ids.includes(s.id));
      if (challengeItems.length > 0) {
        setChallenge(challengeItems);
        setMode('challenge');
      }
    } catch (error) {
      console.error('Invalid challenge link', error);
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem('darkMode', String(isDarkMode));
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const resetToMain = () => {
    setChallenge(null);
    setMode('flash');
  };

  return (
    <div className="app">
      <header className="nav-header">
        <button
          className="theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label={isDarkMode ? 'Hellen Modus aktivieren' : 'Dunklen Modus aktivieren'}
        >
          {isDarkMode ? 'Hell' : 'Dunkel'}
        </button>
        <h1>Rhetorische Stilmittel</h1>
        <p>{data.length} Stilmittel · Übungsapp</p>
        <nav className="mode-tabs" aria-label="Lernmodi">
          {MODES.map(([id, label]) => (
            <button
              key={id}
              className={`mode-tab${mode === id ? ' active' : ''}`}
              onClick={() => setMode(id)}
              aria-current={mode === id ? 'page' : undefined}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {mode === 'flash' && <FlashcardMode data={data} key="flash" />}
      {mode === 'mc' && <MultipleChoiceMode data={data} key="mc" />}
      {mode === 'def' && <DefinitionMode data={data} key="def" />}
      {mode === 'ft' && <FreeTextMode data={data} key="ft" />}
      {mode === 'glossary' && (
        <GlossaryMode
          data={data}
          onStartChallenge={(items) => {
            setChallenge(items);
            setMode('challenge');
          }}
          key="glossary"
        />
      )}
      {mode === 'stats' && <StatsDashboard data={data} key="stats" />}
      {mode === 'srs' && <SRSReviewMode data={data} key="srs" />}
      {mode === 'teacher' && <TeacherTools data={data} key="teacher" />}
      {mode === 'challenge' && challenge && (
        <section className="challenge-mode">
          <div className="card challenge-banner">
            <strong>Herausforderung aktiv</strong>
            <span>{challenge.length} Stilmittel</span>
            <button className="btn btn-ghost compact-btn" onClick={resetToMain}>Beenden</button>
          </div>
          <MultipleChoiceMode data={challenge} />
        </section>
      )}
    </div>
  );
}

export default App;

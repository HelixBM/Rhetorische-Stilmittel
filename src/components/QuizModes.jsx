import React, { useCallback, useEffect, useRef, useState } from 'react';
import { updateProgress } from '../db/stats';
import { generateQuestions, matchFreeTextAnswer } from '../lib/quiz';
import { Explanation, QuizProgress, QuizSettings, Results } from './Shared';

function OptionQuizMode({ data, mode, modeLabel }) {
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const start = useCallback(() => {
    setQuestions(generateQuestions(data, questionCount, mode));
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }, [data, mode, questionCount]);

  useEffect(() => { start(); }, [start]);

  if (!questions) return null;
  if (done) return <Results score={score} total={questions.length} onRestart={start} modeLabel={modeLabel} />;

  const q = questions[qIdx];
  const prompt = mode === 'mc' ? q.example : q.definition;

  const handleSelect = async (name) => {
    if (selected) return;
    setSelected(name);
    const isCorrect = name === q.correctName;
    if (isCorrect) setScore(s => s + 1);
    await updateProgress(q.id, isCorrect);
  };

  const nextQ = () => {
    if (qIdx + 1 >= questions.length) setDone(true);
    else {
      setQIdx(i => i + 1);
      setSelected(null);
    }
  };

  return (
    <div className="card-area">
      <QuizSettings questionCount={questionCount} onQuestionCountChange={e => setQuestionCount(+e.target.value)} onRestart={start} />
      <div className="card">
        <QuizProgress qIdx={qIdx} total={questions.length} />
        <div className={mode === 'mc' ? 'mc-example' : 'def-definition'}>{prompt}</div>
        <div className="mc-options" role="group" aria-label="Antwortoptionen">
          {q.options.map(name => {
            let cls = 'mc-option';
            if (selected) {
              if (name === q.correctName) cls += ' mc-correct';
              else if (name === selected) cls += ' mc-wrong';
            }
            return <button key={name} className={cls} onClick={() => handleSelect(name)}>{name}</button>;
          })}
        </div>
        {selected && (
          <>
            <div className={`feedback ${selected === q.correctName ? 'correct' : 'wrong'}`} aria-live="polite">
              {selected === q.correctName ? 'Richtig.' : `Leider falsch. Die richtige Antwort ist: ${q.correctName}`}
            </div>
            <Explanation item={q.correct} />
            <div className="btn-row next-row">
              <button className="btn btn-primary" onClick={nextQ}>{qIdx + 1 >= questions.length ? 'Ergebnis anzeigen' : 'Nächste Frage'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function MultipleChoiceMode({ data }) {
  return <OptionQuizMode data={data} mode="mc" modeLabel="Multiple Choice" />;
}

export function DefinitionMode({ data }) {
  return <OptionQuizMode data={data} mode="def" modeLabel="Definitionen" />;
}

export function FreeTextMode({ data }) {
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [match, setMatch] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  const start = useCallback(() => {
    setQuestions(generateQuestions(data, questionCount, 'ft'));
    setQIdx(0);
    setInput('');
    setSubmitted(false);
    setMatch(null);
    setScore(0);
    setDone(false);
  }, [data, questionCount]);

  useEffect(() => { start(); }, [start]);

  if (!questions) return null;
  if (done) return <Results score={score} total={questions.length} onRestart={start} modeLabel="Freitext" />;

  const q = questions[qIdx];

  const checkAnswer = async () => {
    if (!input.trim()) return;
    const result = matchFreeTextAnswer(input, q.correct);
    setMatch(result);
    setSubmitted(true);
    if (result.isCorrect) setScore(s => s + 1);
    await updateProgress(q.id, result.isCorrect);
  };

  const nextQ = () => {
    if (qIdx + 1 >= questions.length) setDone(true);
    else {
      setQIdx(i => i + 1);
      setInput('');
      setSubmitted(false);
      setMatch(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="card-area">
      <QuizSettings questionCount={questionCount} onQuestionCountChange={e => setQuestionCount(+e.target.value)} onRestart={start} />
      <div className="card">
        <QuizProgress qIdx={qIdx} total={questions.length} />
        <div className="ft-example">{q.example}</div>
        <div className="ft-input-row">
          <label className="sr-only" htmlFor="free-text-answer">Stilmittel eingeben</label>
          <input
            id="free-text-answer"
            ref={inputRef}
            className={`ft-input${submitted ? (match?.isCorrect ? ' ft-correct' : ' ft-wrong') : ''}`}
            type="text"
            placeholder="Stilmittel eingeben"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !submitted) checkAnswer();
              if (e.key === 'Enter' && submitted) nextQ();
            }}
            disabled={submitted}
            autoFocus
          />
          {!submitted && <button className="btn btn-primary" onClick={checkAnswer}>Prüfen</button>}
        </div>
        {submitted && (
          <>
            <div className={`feedback ${match?.isCorrect ? 'correct' : 'wrong'}`} aria-live="polite">
              {match?.isCorrect
                ? (match.isClose ? `Als richtig gewertet: ${q.correctName}` : 'Richtig.')
                : <span>Leider falsch. Die richtige Antwort ist: <strong>{q.correctName}</strong></span>}
            </div>
            <Explanation item={q.correct} />
            <div className="btn-row next-row">
              <button className="btn btn-primary" onClick={nextQ}>{qIdx + 1 >= questions.length ? 'Ergebnis anzeigen' : 'Nächste Frage'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

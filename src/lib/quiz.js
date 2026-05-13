export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateQuestions(data, count, mode) {
  const qs = [];
  const shuffled = shuffle(data);
  const actualCount = Math.min(count, data.length);

  for (let i = 0; i < actualCount; i++) {
    const correct = shuffled[i];
    const ex = correct.examples[Math.floor(Math.random() * correct.examples.length)];

    if (mode === 'mc') {
      const wrongs = shuffle(data.filter(s => s.name !== correct.name)).slice(0, 3);
      const options = shuffle([correct, ...wrongs]);
      qs.push({ id: correct.id, example: ex, correct, correctName: correct.name, options: options.map(o => o.name) });
    } else if (mode === 'ft') {
      qs.push({ id: correct.id, example: ex, correct, correctName: correct.name, definition: correct.definition });
    } else if (mode === 'def') {
      const wrongs = shuffle(data.filter(s => s.name !== correct.name)).slice(0, 3);
      const options = shuffle([correct, ...wrongs]);
      qs.push({ id: correct.id, definition: correct.definition, correct, correctName: correct.name, options: options.map(o => o.name) });
    }
  }

  return qs;
}

export function normalizeAnswer(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return row[b.length];
}

export function matchFreeTextAnswer(input, item) {
  const accepted = [item.name, ...(item.aliases ?? [])].map(normalizeAnswer).filter(Boolean);
  const answer = normalizeAnswer(input);
  if (!answer) return { isCorrect: false, isClose: false };
  if (accepted.includes(answer)) return { isCorrect: true, isClose: false };

  const bestDistance = Math.min(...accepted.map(value => levenshtein(answer, value)));
  const targetLength = Math.min(...accepted.map(value => value.length));
  const allowedDistance = targetLength <= 8 ? 1 : 2;

  return {
    isCorrect: bestDistance <= allowedDistance,
    isClose: bestDistance <= allowedDistance,
    distance: bestDistance,
  };
}

export function buildResultSummary({ score, total, modeLabel }) {
  const pct = total ? Math.round((score / total) * 100) : 0;
  return `Rhetorische Stilmittel - ${modeLabel}: ${score}/${total} richtig (${pct}%).`;
}

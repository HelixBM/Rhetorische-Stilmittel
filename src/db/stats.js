import { openDB } from 'idb';

const DB_NAME = 'stilmittel-stats';
const STORE_NAME = 'progress';

export async function initStatsDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'stilId' });
      }
    },
  });
}

export async function getProgress(stilId) {
  const db = await initStatsDB();
  return (await db.get(STORE_NAME, stilId)) || { 
    stilId, 
    correct: 0, 
    total: 0, 
    streak: 0, 
    level: 'Novice', 
    lastSeen: null, 
    nextReview: null,
    interval: 0 // in days
  };
}

export async function updateProgress(stilId, isCorrect) {
  const db = await initStatsDB();
  const current = await getProgress(stilId);
  
  const newCorrect = isCorrect ? current.correct + 1 : current.correct;
  const newTotal = current.total + 1;
  const newStreak = isCorrect ? current.streak + 1 : 0;
  
  // SRS Logic (Simplified)
  let newInterval = current.interval || 0;
  if (isCorrect) {
    if (newInterval === 0) newInterval = 1;
    else if (newInterval === 1) newInterval = 3;
    else if (newInterval === 3) newInterval = 7;
    else if (newInterval === 7) newInterval = 14;
    else if (newInterval === 14) newInterval = 30;
    else newInterval = newInterval * 2;
  } else {
    newInterval = 0; // Reset on failure
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  
  // Basic Badge/Level logic
  let level = 'Novice';
  if (newStreak >= 10) level = 'Grandmaster';
  else if (newStreak >= 7) level = 'Master';
  else if (newStreak >= 5) level = 'Expert';
  else if (newStreak >= 3) level = 'Practitioner';

  const updated = {
    ...current,
    correct: newCorrect,
    total: newTotal,
    streak: newStreak,
    level,
    lastSeen: new Date().toISOString(),
    nextReview: nextReviewDate.toISOString(),
    interval: newInterval
  };

  await db.put(STORE_NAME, updated);
  return updated;
}

export async function getAllProgress() {
  const db = await initStatsDB();
  return db.getAll(STORE_NAME);
}

export async function getDueItems(data) {
  const progress = await getAllProgress();
  const now = new Date();
  
  const dueIds = progress
    .filter(p => p.nextReview && new Date(p.nextReview) <= now)
    .map(p => p.stilId);
    
  return data.filter(d => dueIds.includes(d.id));
}

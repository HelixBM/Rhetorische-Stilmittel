import React, { useEffect, useState } from 'react';
import { getDueItems } from '../db/stats';
import { MultipleChoiceMode } from './QuizModes';

export default function SRSReviewMode({ data }) {
  const [dueItems, setDueItems] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDueItems(data).then(items => {
      setDueItems(items);
      setLoading(false);
    });
  }, [data]);

  if (loading) return <div className="card-area"><div className="card">Suche fällige Aufgaben...</div></div>;
  if (!dueItems || dueItems.length === 0) {
    return (
      <div className="card-area">
        <div className="card centered-card">
          <h2 className="section-title">Alles erledigt</h2>
          <p className="muted-text">Du hast momentan keine fälligen Wiederholungen. Übe in einem anderen Modus weiter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="srs-review">
      <p className="srs-count">{dueItems.length} fällige Wiederholungen</p>
      <MultipleChoiceMode data={dueItems} />
    </div>
  );
}

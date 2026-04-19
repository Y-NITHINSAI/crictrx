import React from 'react';

export default function MatchList({ matches, onOpen }) {
  return (
    <div>
      <h2>Matches</h2>
      <div className="match-list">
        {matches.map(m => {
          const inning = m.innings[0];
          return (
            <div key={m.id} className="match-card" onClick={() => onOpen(m)}>
              <div><strong>{m.teams.home}</strong> vs <strong>{m.teams.away}</strong></div>
              <div>
                {m.status === 'LIVE' ? <span className="live">LIVE</span> : m.status}
              </div>
              {inning && (
                <div style={{ marginTop:8 }}>
                  <div><strong>{inning.runs}/{inning.wickets}</strong> ({inning.overs})</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
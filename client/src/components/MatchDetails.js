import React from 'react';
import ScoreBoard from './ScoreBoard';

export default function MatchDetails({ match, onClose }) {
  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={onClose}>Close</button>
      <h2>{match.teams.home} vs {match.teams.away} {match.status === 'LIVE' && <span style={{color:'red'}}>LIVE</span>}</h2>

      <ScoreBoard innings={match.innings} />

      <div style={{ marginTop: 12 }}>
        <h3>Commentary</h3>
        <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #eee', padding: 8, borderRadius: 6 }}>
          {match.commentary.length === 0 && <div>No commentary yet</div>}
          {match.commentary.map((c, idx) => (
            <div key={idx} style={{ padding: '6px 0', borderBottom: '1px solid #fafafa' }}>
              <div style={{ fontSize: 12, color: '#666' }}>{new Date(c.time).toLocaleTimeString()}</div>
              <div>{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
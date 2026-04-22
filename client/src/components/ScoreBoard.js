import React from 'react';

export default function ScoreBoard({ innings }) {
  if (!innings || innings.length === 0) return <div>No innings yet</div>;
  return (
    <div style={{ display:'flex', gap:12 }}>
      {innings.map((inn, i) => (
        <div key={i} style={{ border:'1px solid #eee', padding:12, borderRadius:6 }}>
          <div style={{ fontSize: 12, color:'#555' }}>{inn.team}</div>
          <div style={{ fontSize: 20, fontWeight:700 }}>{inn.runs}/{inn.wickets}</div>
          <div style={{ fontSize: 13, color:'#777' }}>{inn.overs} overs</div>
        </div>
      ))}
    </div>
  );
}
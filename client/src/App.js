import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import MatchList from './components/MatchList';
import MatchDetails from './components/MatchDetails';

const BACKEND = 'http://localhost:4000';

export default function App() {
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    fetch(`${BACKEND}/api/matches`)
      .then(r => r.json())
      .then(setMatches)
      .catch(console.error);

    socketRef.current = io(BACKEND);
    socketRef.current.on('connect', () => {
      console.log('connected to socket', socketRef.current.id);
    });
    socketRef.current.on('scoreUpdate', ({ matchId, match }) => {
      setMatches(prev => prev.map(m => m.id === matchId ? match : m));
      if (selected && selected.id === matchId) {
        setSelected(match);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [selected]);

  function openMatch(match) {
    setSelected(match);
    // join room
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('joinMatch', match.id);
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>CricTRX</h1>
        <div>Live cricket scores & commentary</div>
      </div>

      <MatchList matches={matches} onOpen={openMatch} />

      {selected && (
        <MatchDetails
          match={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
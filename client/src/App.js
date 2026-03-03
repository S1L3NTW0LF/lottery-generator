import React, { useState, useEffect } from 'react';

function App() {
  const [numbers, setNumbers] = useState([]);
  const [hot, setHot] = useState([]);
  const [cold, setCold] = useState([]);
  const [topAll, setTopAll] = useState([]);
  const [topRecent, setTopRecent] = useState([]);
  const [topCommon, setTopCommon] = useState([]);



  const generateNumbers = async () => {
    const response = await fetch('http://localhost:5000/api/generate');
    const data = await response.json();
    setNumbers(data.numbers);
    setHot(data.hot);
    setCold(data.cold);
    setTopCommon(data.topCommon);
  };


  const fetchStats = async () => {
    const response = await fetch('http://localhost:5000/api/stats');
    const data = await response.json();
    setHot(data.hot);
    setCold(data.cold);
  };

  const fetchFrequency = async () => {
  const response = await fetch('http://localhost:5000/api/frequency');
  const data = await response.json();
  setTopAll(data.topAll);
  setTopRecent(data.topRecent);
};

useEffect(() => {
  fetchStats();
  fetchFrequency();
}, []);


  const getColor = (num) => {
    if (hot.includes(num)) return '#e74c3c'; // red for hot
    if (cold.includes(num)) return '#3498db'; // blue for cold
    return '#2ecc71'; // green for random
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🎲 Lottery Number Generator</h1>
      <button onClick={generateNumbers}>Generate Numbers</button>

      <div style={{ marginTop: '30px', fontSize: '24px' }}>
        <strong>Your Draw:</strong>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
          {numbers.map((num, index) => {
            const isHot = hot.includes(num);
            const isCold = cold.includes(num);
            const isCommon = topCommon.includes(num); // ← from backend

            const bgColor = isHot ? '#e74c3c' : isCold ? '#3498db' : '#2ecc71'; // red, blue, green
            const label = isCommon ? `${num}*` : `${num}`; // ← add asterisk if common

            return (
              <div
                key={index}
                style={{
                  padding: '10px 15px',
                  borderRadius: '50%',
                  backgroundColor: bgColor,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '20px'
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>🔥 Hot Numbers (4+ appearances)</h2>
        <p>{hot.join(', ') || 'None'}</p>

        <h2>❄️ Cold Numbers (0 appearances)</h2>
        <p>{cold.join(', ') || 'None'}</p>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>📊 Most Common Numbers (Last 16 Draws)</h2>
        <p>{topRecent.join(', ') || 'None'}</p>

        <h2>📊 Most Common Numbers (All Time)</h2>
        <p>{topAll.join(', ') || 'None'}</p>
      </div>


      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <p><span style={{ color: '#e74c3c' }}>🔴</span> Hot (4+ recent appearances)</p>
        <p><span style={{ color: '#3498db' }}>🔵</span> Cold (0 recent appearances)</p>
        <p><span style={{ color: '#2ecc71' }}>🟢</span> Random pick</p>
        <p><strong>*</strong> = Top 6 most common overall</p>
      </div>
    </div>
  );
}

export default App;
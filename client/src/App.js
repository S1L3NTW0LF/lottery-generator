import React, { useState, useEffect } from 'react';
import Dice from './Dice';
import './App.css';

function App() {
  const [numbers, setNumbers] = useState([]);
  const [hot, setHot] = useState([]);
  const [cold, setCold] = useState([]);
  const [topAll, setTopAll] = useState([]);
  const [topRecent, setTopRecent] = useState([]);
  const [topCommon, setTopCommon] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [drawCount, setDrawCount] = useState(0);

  const generateNumbers = async () => {
    setGenerating(true);
    setNumbers([]);
    setServerError(false);
    try {
      const response = await fetch('http://localhost:5000/api/generate');
      const data = await response.json();
      setTimeout(() => {
        setNumbers(data.numbers);
        setHot(data.hot);
        setCold(data.cold);
        setTopCommon(data.topCommon);
        setGenerating(false);
        setDrawCount(c => c + 1);
      }, 150);
    } catch (err) {
      setServerError(true);
      setGenerating(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats');
      const data = await response.json();
      setHot(data.hot);
      setCold(data.cold);
    } catch (err) {
      setServerError(true);
    }
  };

  const fetchFrequency = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/frequency');
      const data = await response.json();
      setTopAll(data.topAll);
      setTopRecent(data.topRecent);
    } catch (err) {
      console.error('Could not load frequency data:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchFrequency();
  }, []);

  const getBallColor = (num) => {
    if (hot.includes(num)) return 'hot';
    if (cold.includes(num)) return 'cold';
    return 'neutral';
  };

  const getDelay = (index) => index * 400;

  return (
    <div className="app-wrapper">
      {/* Ambient background orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <div className="app-container">

        {/* Header */}
        <header className="app-header">
          <div className="header-eyebrow">Michigan</div>
          <h1 className="app-title">LOTTO<span className="title-accent">47</span></h1>
          <p className="app-subtitle">Statistical Number Generator</p>
          {drawCount > 0 && (
            <div className="draw-badge">Draw #{drawCount}</div>
          )}
        </header>

        {/* Server error banner */}
        {serverError && (
          <div className="error-banner">
            ⚠️ Cannot connect to server — make sure it's running on port 5000
          </div>
        )}

        {/* Main draw area */}
        <section className="draw-section">
          <div className="draw-card">
            <div className="draw-label">YOUR NUMBERS</div>
            <div className="balls-row">
              {numbers.length > 0
                ? numbers.map((num, index) => (
                    <Dice
                      key={`${num}-${index}-${drawCount}`}
                      finalNumber={num}
                      delay={getDelay(index)}
                      colorType={getBallColor(num)}
                      isCommon={topCommon.includes(num)}
                    />
                  ))
                : Array.from({ length: 6 }).map((_, index) => (
                    <Dice
                      key={`empty-${index}`}
                      finalNumber={null}
                      delay={0}
                      colorType="empty"
                      isCommon={false}
                    />
                  ))
              }
            </div>

            <button
              className={`generate-btn ${generating ? 'generating' : ''}`}
              onClick={generateNumbers}
              disabled={generating}
            >
              <span className="btn-icon">{generating ? '⟳' : '✦'}</span>
              <span>{generating ? 'Drawing Numbers...' : 'Generate My Numbers'}</span>
            </button>
          </div>
        </section>

        {/* Legend */}
        <div className="legend">
          <div className="legend-item">
            <span className="legend-dot dot-hot" />
            <span>Hot — 4+ recent draws</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-cold" />
            <span>Cold — no recent draws</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-neutral" />
            <span>Random pick</span>
          </div>
          <div className="legend-item">
            <span className="legend-star">★</span>
            <span>Top 6 all-time</span>
          </div>
        </div>

        {/* Stats grid */}
        <section className="stats-grid">
          <div className="stat-card hot-card">
            <div className="stat-card-header">
              <span className="stat-icon">🔥</span>
              <h3>Hot Numbers</h3>
              <span className="stat-subtitle">4+ in last 16 draws</span>
            </div>
            <div className="stat-numbers">
              {hot.length > 0
                ? hot.map(n => <span key={n} className="stat-pill pill-hot">{n}</span>)
                : <span className="stat-empty">None right now</span>
              }
            </div>
          </div>

          <div className="stat-card cold-card">
            <div className="stat-card-header">
              <span className="stat-icon">❄️</span>
              <h3>Cold Numbers</h3>
              <span className="stat-subtitle">0 in last 16 draws</span>
            </div>
            <div className="stat-numbers">
              {cold.length > 0
                ? cold.map(n => <span key={n} className="stat-pill pill-cold">{n}</span>)
                : <span className="stat-empty">None right now</span>
              }
            </div>
          </div>

          <div className="stat-card freq-card">
            <div className="stat-card-header">
              <span className="stat-icon">📈</span>
              <h3>Most Common</h3>
              <span className="stat-subtitle">Last 16 draws</span>
            </div>
            <div className="stat-numbers">
              {topRecent.length > 0
                ? topRecent.map(n => <span key={n} className="stat-pill pill-neutral">{n}</span>)
                : <span className="stat-empty">Loading...</span>
              }
            </div>
          </div>

          <div className="stat-card alltime-card">
            <div className="stat-card-header">
              <span className="stat-icon">🏆</span>
              <h3>All-Time Leaders</h3>
              <span className="stat-subtitle">Full history</span>
            </div>
            <div className="stat-numbers">
              {topAll.length > 0
                ? topAll.map(n => <span key={n} className="stat-pill pill-gold">{n}</span>)
                : <span className="stat-empty">Loading...</span>
              }
            </div>
          </div>
        </section>

        <footer className="app-footer">
          For entertainment purposes only · Michigan Lotto 47
        </footer>
      </div>
    </div>
  );
}

export default App;

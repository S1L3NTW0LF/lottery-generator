const express = require('express');
const cors = require('cors');
const loadDraws = require('./loadDraws');
const getHotCold = require('./analyzeDraws');

const app = express();
const PORT = 5000;

app.use(cors());

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pickAndRemove = (pool) => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const index = array[0] % pool.length;
  const num = pool[index];
  pool.splice(index, 1);
  return num;
};

const countFrequency = (draws) => {
  const freq = {};
  draws.forEach(draw => {
    draw.forEach(num => {
      freq[num] = (freq[num] || 0) + 1;
    });
  });
  return freq;
};

// 50% → 1 slot,  30% → 0 slots,  20% → 2 slots
const rollSlotCount = () => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const roll = array[0] % 100;
  if (roll < 50) return 1;
  if (roll < 80) return 0;
  return 2;
};

// ─── Route: Generate ──────────────────────────────────────────────────────────
app.get('/api/generate', (req, res) => {
  loadDraws((draws) => {
    const { hot, cold } = getHotCold(draws);

    let hotCount  = rollSlotCount();
    let coldCount = rollSlotCount();

    // Cap hot+cold at 4 to guarantee at least 2 random slots
    if (hotCount + coldCount > 4) {
      const excess = (hotCount + coldCount) - 4;
      coldCount = Math.max(0, coldCount - excess);
      if (hotCount + coldCount > 4) hotCount = 4 - coldCount;
    }

    const hotPool  = [...hot];
    const coldPool = [...cold];
    let remaining  = Array.from({ length: 47 }, (_, i) => i + 1);
    const draw     = [];

    for (let i = 0; i < hotCount; i++) {
      if (hotPool.length === 0) break;
      const num = pickAndRemove(hotPool);
      draw.push(num);
      remaining = remaining.filter(n => n !== num);
    }

    for (let i = 0; i < coldCount; i++) {
      if (coldPool.length === 0) break;
      const num = pickAndRemove(coldPool);
      draw.push(num);
      remaining = remaining.filter(n => n !== num);
    }

    while (draw.length < 6) {
      draw.push(pickAndRemove(remaining));
    }

    const allFreq = countFrequency(draws);
    const topCommon = Object.entries(allFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([num]) => parseInt(num));

    res.json({
      numbers: draw.sort((a, b) => a - b),
      hot,
      cold,
      topCommon,
      hotCount,
      coldCount,
    });
  });
});

// ─── Route: Stats ─────────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  loadDraws((draws) => {
    const { hot, cold } = getHotCold(draws);
    res.json({ hot, cold });
  });
});

// ─── Route: Frequency ─────────────────────────────────────────────────────────
app.get('/api/frequency', (req, res) => {
  loadDraws((draws) => {
    const allFreq    = countFrequency(draws);
    const recentFreq = countFrequency(draws.slice(-16));

    const topNumbers = (freqMap) =>
      Object.entries(freqMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([num]) => parseInt(num));

    res.json({
      topAll:    topNumbers(allFreq),
      topRecent: topNumbers(recentFreq),
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
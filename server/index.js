const express = require('express');
const cors = require('cors');
const loadDraws = require('./loadDraws');
const getHotCold = require('./analyzeDraws');

const app = express();
const PORT = 5000;

app.use(cors());

// ✅ Route 1: Generate a smart draw
app.get('/api/generate', (req, res) => {
  loadDraws((draws) => {
    const { hot, cold } = getHotCold(draws);

/*     const pickAndRemove = (pool) => {
      const index = Math.floor(Math.random() * pool.length);
      const num = pool[index];
      pool.splice(index, 1);
      return num;
    }; */

    const pickAndRemove = (pool) => {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const index = array[0] % pool.length;
      const num = pool[index];
      pool.splice(index, 1);
      return num;
    };



    let allNumbers = Array.from({ length: 47 }, (_, i) => i + 1);
    const hotPool = allNumbers.filter(n => hot.includes(n));
    const coldPool = allNumbers.filter(n => cold.includes(n));

    const draw = [];

    if (hotPool.length > 0) {
      const hotNum = pickAndRemove(hotPool);
      draw.push(hotNum);
      allNumbers = allNumbers.filter(n => n !== hotNum);
    }

    if (coldPool.length > 0) {
      const coldNum = pickAndRemove(coldPool);
      draw.push(coldNum);
      allNumbers = allNumbers.filter(n => n !== coldNum);
    }

    while (draw.length < 6) {
      draw.push(pickAndRemove(allNumbers));
    }

    const countFrequency = (drawsSubset) => {
      const freq = {};
      drawsSubset.forEach(draw => {
        draw.forEach(num => {
          freq[num] = (freq[num] || 0) + 1;
        });
      });
      return freq;
    };


    const allFreq = countFrequency(draws);
      const topAll = Object.entries(allFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([num]) => parseInt(num));



    res.json({
      numbers: draw.sort((a, b) => a - b),
      hot,
      cold,
      topCommon: topAll
    });

  });
});

// ✅ Route 2: Return hot/cold stats separately
app.get('/api/stats', (req, res) => {
  loadDraws((draws) => {
    const { hot, cold } = getHotCold(draws);
    res.json({ hot, cold });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// FREQUENCY
app.get('/api/frequency', (req, res) => {
  loadDraws((draws) => {
    const countFrequency = (drawsSubset) => {
      const freq = {};
      drawsSubset.forEach(draw => {
        draw.forEach(num => {
          freq[num] = (freq[num] || 0) + 1;
        });
      });
      return freq;
    };

    const allFreq = countFrequency(draws);
    const recentFreq = countFrequency(draws.slice(-16));

    const topNumbers = (freqMap) => {
      return Object.entries(freqMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([num]) => parseInt(num));
    };

    res.json({
      topAll: topNumbers(allFreq),
      topRecent: topNumbers(recentFreq)
    });
  });
});
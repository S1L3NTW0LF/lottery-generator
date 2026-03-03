function getHotCold(draws) {
  const recentDraws = draws.slice(-16); // last 16 draws
  const frequency = {};

  recentDraws.forEach(draw => {
    draw.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
  });

  const hot = Object.keys(frequency)
    .filter(num => frequency[num] >= 4)
    .map(n => parseInt(n));

  const cold = Array.from({ length: 47 }, (_, i) => i + 1)
    .filter(n => !frequency[n]);

  return { hot, cold };
}

module.exports = getHotCold;
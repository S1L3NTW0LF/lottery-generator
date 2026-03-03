const fs = require('fs');
const csv = require('csv-parser');

function loadDraws(callback) {
  const results = [];

  fs.createReadStream('michigan47.csv')
    .pipe(csv({ headers: ['date', 'numbers', 'type'] }))
    .on('data', (data) => {
      // Only include REGULAR DRAWING (optional filter)
      if (data.type === 'REGULAR DRAWING') {
        const numbers = data.numbers
          .split(',')
          .map(n => parseInt(n.trim(), 10))
          .filter(n => !isNaN(n));
        results.push(numbers);
      }
    })
    .on('end', () => {
      callback(results);
    });
}

module.exports = loadDraws;
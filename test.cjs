const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

// Find all id="..." in index.html
const idRegex = /id=["']([a-zA-Z0-9_-]+)["']/g;
const idsInHtml = new Set();
let match;
while ((match = idRegex.exec(html)) !== null) {
  idsInHtml.add(match[1]);
}

// Find all document.getElementById('...') in app.js
const getElemRegex = /getElementById\(['"]([a-zA-Z0-9_-]+)['"]\)/g;
const missingIds = [];
while ((match = getElemRegex.exec(js)) !== null) {
  const idName = match[1];
  if (!idsInHtml.has(idName) && !missingIds.includes(idName)) {
    missingIds.push(idName);
  }
}

console.log('Missing IDs:', missingIds);

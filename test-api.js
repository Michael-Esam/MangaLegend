const http = require('http');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function test() {
  try {
    const trending = await fetchJSON('http://localhost:3000/api/trending');
    console.log('API Response length:', trending.length);
    console.log('First item keys:', Object.keys(trending[0]));
    console.log('First item ID:', trending[0].id);
    console.log('First item title:', trending[0].title);
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();

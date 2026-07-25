const http = require('http');

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: data });
      });
    }).on('error', reject);
  });
}

async function test() {
  try {
    const result = await fetchURL('http://localhost:3000/api/trending');
    console.log('Status:', result.status);
    console.log('Data length:', result.data.length);
    console.log('First 200 chars:', result.data.substring(0, 200));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();

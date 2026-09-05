const fetch = require('node-fetch') || globalThis.fetch;
(async () => {
  const urls = [
    'https://cdn.readdetectiveconan.com/file/mangapill/i/3.jpeg', // Monster
    'https://cdn.readdetectiveconan.com/file/mangapill/i/6681.jpeg', // JJK
    'https://cdn.readdetectiveconan.com/file/mangapill/i/104.jpeg',
    'https://mangadex.org/covers/abc/abc.jpg'
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'Referer': 'https://mangapill.com/',
          'User-Agent': 'Mozilla/5.0'
        }
      });
      console.log(url, res.status, res.headers.get('content-type'), await res.text().then(t => t.slice(0,50)));
    } catch(e) {
      console.log(url, 'ERROR', e.message);
    }
  }
})();

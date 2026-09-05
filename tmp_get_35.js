const fs = require('fs');

async function getAllMangaMap() {
  const queryTitles = [
    'one-piece',
    'jujutsu-kaisen',
    'berserk',
    'vinland-saga',
    'chainsaw-man',
    'attack-on-titan',
    'demon-slayer',
    'my-hero-academia',
    'bleach',
    'naruto',
    'death-note',
    'tokyo-ghoul',
    'solo-leveling',
    'dragon-ball',
    'fullmetal-alchemist',
    'hunter-x-hunter',
    'one-punch-man',
    'black-clover',
    'spy-x-family',
    'tokyo-revengers',
    'blue-lock',
    'haikyuu',
    'dr-stone',
    'kingdom',
    'vagabond',
    'monster',
    'slam-dunk',
    'jojo',
    'tower-of-god',
    'wind-breaker',
    'kaiju-no-8',
    'dandadan',
    'frieren',
    'boruto',
    'mashle',
    'hells-paradise',
    'gintama',
    'fairy-tail',
    'fire-force',
    'blue-exorcist'
  ];

  const map = [];

  for (const t of queryTitles) {
    try {
      const res = await fetch(`https://consumet-api-rouge.vercel.app/manga/mangapill/${encodeURIComponent(t)}`);
      if (res.ok) {
        const data = await res.json();
        const results = Array.isArray(data) ? data : (data.results || []);
        const match = results.find(m => m.title.toLowerCase().includes(t.replace(/-/g, ' '))) || results[0];
        if (match && match.image) {
          map.push({
            id: match.id,
            title: match.title,
            image: match.image,
            status: match.status || 'Ongoing',
            genres: match.genres || ['Action', 'Adventure', 'Shounen']
          });
        }
      }
    } catch (e) {
      console.error('Error fetching', t, e);
    }
  }

  fs.writeFileSync('d:\\MangaLegends\\manga_35_map.json', JSON.stringify(map, null, 2));
  console.log('SAVED', map.length, 'VALID MANGA TO manga_35_map.json');
}

getAllMangaMap();

const { put, list } = require('@vercel/blob');
const F = 'lueurs-records.json';
async function read() {
  const { blobs } = await list({ prefix: F });
  if (!blobs.length) return [];
  try { const r = await fetch(blobs[0].url + '?t=' + Date.now(), { cache: 'no-store' }); const d = await r.json(); return Array.isArray(d) ? d : []; } catch (e) { return []; }
}
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    let top = await read();
    if (req.method === 'POST') {
      const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const score = Math.floor(Number(b.score));
      const name = String(b.name || '').replace(/[^\p{L}\p{N} _-]/gu, '').trim().slice(0, 12);
      if (!(score > 0 && score <= 5000) || name.length < 2) return res.status(400).json({ error: 'invalid' });
      top.push({ name, score, date: new Date().toISOString().slice(0, 10) });
      top.sort((a, c) => c.score - a.score);
      top = top.slice(0, 10);
      await put(F, JSON.stringify(top), { access: 'public', allowOverwrite: true, addRandomSuffix: false, contentType: 'application/json' });
    }
    res.status(200).json(top);
  } catch (e) {
    res.status(500).json({ error: 'storage' });
  }
};

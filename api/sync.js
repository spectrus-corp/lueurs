const { put, list } = require('@vercel/blob');

function normCode(c) {
  c = String(c || '').toUpperCase().replace(/[^A-Z0-9-]/g, '');
  if (!c.startsWith('SYNC-')) c = 'SYNC-' + c.replace(/^SYNC/, '');
  const body = c.slice(5).replace(/[^A-Z0-9]/g, '').slice(0, 8);
  if (body.length < 6) return null;
  return 'SYNC-' + body;
}

function fileFor(code) {
  return 'lueurs-sync-' + code.replace(/[^A-Z0-9]/g, '') + '.json';
}

async function readSync(code) {
  const F = fileFor(code);
  const { blobs } = await list({ prefix: F });
  if (!blobs.length) return null;
  try {
    const r = await fetch(blobs[0].url + '?t=' + Date.now(), { cache: 'no-store' });
    const d = await r.json();
    return d && typeof d === 'object' ? d : null;
  } catch (e) {
    return null;
  }
}

function sanitize(b) {
  const wallet = Math.max(0, Math.floor(Number(b.wallet) || 0));
  if (wallet > 50000000) throw new Error('invalid wallet');
  const owned = Array.isArray(b.owned)
    ? b.owned.filter((id) => typeof id === 'string' && /^[ktau]\d+$/.test(id)).slice(0, 120)
    : [];
  const eq = {
    k: typeof b.eq?.k === 'string' && /^k\d+$/.test(b.eq.k) ? b.eq.k : 'k0',
    t: typeof b.eq?.t === 'string' && /^t\d+$/.test(b.eq.t) ? b.eq.t : 't0',
    a: typeof b.eq?.a === 'string' && /^a\d+$/.test(b.eq.a) ? b.eq.a : 'a0'
  };
  const rankPts = Math.max(0, Math.floor(Number(b.rankPts) || 0));
  const best = Math.max(0, Math.floor(Number(b.best) || 0));
  return {
    wallet,
    owned,
    eq,
    rankPts,
    best,
    updated: Date.now()
  };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const code = normCode(req.query?.code || '');
      if (!code) return res.status(400).json({ error: 'code' });
      const d = await readSync(code);
      if (!d) return res.status(404).json({ error: 'not_found' });
      return res.status(200).json(d);
    }
    if (req.method === 'POST') {
      const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const action = b.action || 'put';
      if (action === 'create') {
        const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let body = '';
        for (let i = 0; i < 6; i++) body += alphabet[Math.floor(Math.random() * alphabet.length)];
        const code = 'SYNC-' + body;
        const data = sanitize(b);
        data.code = code;
        await put(fileFor(code), JSON.stringify(data), {
          access: 'public',
          allowOverwrite: true,
          addRandomSuffix: false,
          contentType: 'application/json'
        });
        return res.status(200).json({ code, ...data });
      }
      const code = normCode(b.code || '');
      if (!code) return res.status(400).json({ error: 'code' });
      if (action === 'get') {
        const d = await readSync(code);
        if (!d) return res.status(404).json({ error: 'not_found' });
        return res.status(200).json(d);
      }
      const incoming = sanitize(b);
      const existing = await readSync(code);
      let data;
      if (!existing) {
        data = { ...incoming, code };
      } else {
        const owned = Array.from(new Set([...(existing.owned || []), ...incoming.owned]));
        data = {
          code,
          wallet: Math.max(existing.wallet || 0, incoming.wallet),
          owned,
          eq: (incoming.updated >= (existing.updated || 0) ? incoming.eq : existing.eq) || incoming.eq,
          rankPts: Math.max(existing.rankPts || 0, incoming.rankPts || 0),
          best: Math.max(existing.best || 0, incoming.best || 0),
          updated: Date.now()
        };
      }
      await put(fileFor(code), JSON.stringify(data), {
        access: 'public',
        allowOverwrite: true,
        addRandomSuffix: false,
        contentType: 'application/json'
      });
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'method' });
  } catch (e) {
    res.status(500).json({ error: 'storage', message: String(e && e.message || e) });
  }
};

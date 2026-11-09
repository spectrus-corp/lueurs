const { put, list } = require('@vercel/blob');
const crypto = require('crypto');

function clientIp(req) {
  const xf = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = xf || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
  return crypto.createHash('sha256').update(String(ip)).digest('hex').slice(0, 24);
}

function fileFor(ipHash) {
  return 'lueurs-wallet-' + ipHash + '.json';
}

function okId(id) {
  return typeof id === 'string' && /^[ktauv]\d{1,3}$/.test(id);
}

function sanitize(b) {
  const wallet = Math.max(0, Math.floor(Number(b.wallet) || 0));
  if (wallet > 50000000) throw new Error('invalid wallet');
  let owned = [];
  if (Array.isArray(b.owned)) {
    owned = b.owned.filter(okId).slice(0, 120);
  } else if (b.owned && typeof b.owned === 'object') {
    owned = Object.keys(b.owned).filter(okId).slice(0, 120);
  }
  const eqIn = b.eq && typeof b.eq === 'object' ? b.eq : {};
  const eq = {
    k: typeof eqIn.k === 'string' && /^k\d+$/.test(eqIn.k) ? eqIn.k : 'k0',
    t: typeof eqIn.t === 'string' && /^t\d+$/.test(eqIn.t) ? eqIn.t : 't0',
    a: typeof eqIn.a === 'string' && /^a\d+$/.test(eqIn.a) ? eqIn.a : 'a0',
    v: typeof eqIn.v === 'string' && /^v\d+$/.test(eqIn.v) ? eqIn.v : 'v0'
  };
  const rankPts = Math.max(0, Math.floor(Number(b.rankPts) || 0));
  const best = Math.max(0, Math.floor(Number(b.best) || 0));
  return { wallet, owned, eq, rankPts, best, updated: new Date().toISOString() };
}

async function readWallet(ipHash) {
  const F = fileFor(ipHash);
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

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const ipHash = clientIp(req);
    if (req.method === 'GET') {
      const d = await readWallet(ipHash);
      return res.status(200).json(
        d || { wallet: 0, owned: [], eq: { k: 'k0', t: 't0', a: 'a0', v: 'v0' }, rankPts: 0, best: 0 }
      );
    }
    if (req.method === 'POST') {
      const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const data = sanitize(b);
      const prev = await readWallet(ipHash);
      if (prev) {
        data.wallet = Math.max(data.wallet, Math.floor(Number(prev.wallet) || 0));
        const set = new Set([...(prev.owned || []), ...data.owned]);
        data.owned = Array.from(set).filter(okId).slice(0, 120);
        data.rankPts = Math.max(data.rankPts, Math.floor(Number(prev.rankPts) || 0));
        data.best = Math.max(data.best, Math.floor(Number(prev.best) || 0));
      }
      data.ip = ipHash.slice(0, 8);
      await put(fileFor(ipHash), JSON.stringify(data), {
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

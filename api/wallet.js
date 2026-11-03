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
  try {
    const ipHash = clientIp(req);
    if (req.method === 'GET') {
      const d = await readWallet(ipHash);
      return res.status(200).json(d || { wallet: 0, owned: [], eq: { k: 'k0', t: 't0' } });
    }
    if (req.method === 'POST') {
      const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const wallet = Math.max(0, Math.floor(Number(b.wallet) || 0));
      if (wallet > 50000000) return res.status(400).json({ error: 'invalid' });
      const owned = Array.isArray(b.owned)
        ? b.owned.filter((id) => typeof id === 'string' && /^[kt]\d+$/.test(id)).slice(0, 40)
        : [];
      const eq = {
        k: typeof b.eq?.k === 'string' && /^k\d+$/.test(b.eq.k) ? b.eq.k : 'k0',
        t: typeof b.eq?.t === 'string' && /^t\d+$/.test(b.eq.t) ? b.eq.t : 't0'
      };
      const data = { wallet, owned, eq, updated: new Date().toISOString() };
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
    res.status(500).json({ error: 'storage' });
  }
};

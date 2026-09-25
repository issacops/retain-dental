/**
 * Minimal Web Push sender (RFC 8291 aes128gcm + RFC 8188 + VAPID).
 *
 * Uses Web Crypto and fetch only — so it runs on Cloudflare Workers/Pages
 * Functions AND Node 18+ without any native dependency.
 *
 * Usage:
 *   await sendWebPush(subscription, JSON.stringify(payload), {
 *     publicKey: env.VAPID_PUBLIC_KEY,   // base64url, uncompressed P-256
 *     privateKey: env.VAPID_PRIVATE_KEY, // base64url, 32-byte scalar
 *     subject: env.VAPID_SUBJECT,
 *   });
 */

const enc = new TextEncoder();

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

const b64urlToBytes = (s) => {
  const clean = (s || '').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const out = [];
  let bits = 0, val = 0;
  for (let i = 0; i < clean.length; i++) {
    const idx = B64.indexOf(clean[i]);
    if (idx === -1) continue;
    val = (val << 6) | idx; bits += 6;
    if (bits >= 8) { bits -= 8; out.push((val >> bits) & 0xff); }
  }
  return new Uint8Array(out);
};

const bytesToB64url = (bytes) => {
  let out = '';
  let bits = 0, val = 0;
  for (let i = 0; i < bytes.length; i++) {
    val = (val << 8) | bytes[i]; bits += 8;
    while (bits >= 6) { bits -= 6; out += B64[(val >> bits) & 0x3f]; }
  }
  if (bits > 0) out += B64[(val << (6 - bits)) & 0x3f];
  return out;
};

const concat = (...arrs) => {
  const len = arrs.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(len);
  let o = 0;
  for (const a of arrs) { out.set(a, o); o += a.length; }
  return out;
};

const hkdf = async (salt, ikm, info, length) => {
  const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, key, length * 8);
  return new Uint8Array(bits);
};

async function vapidAuthorization(endpoint, vapid) {
  const aud = new URL(endpoint).origin;
  const header = { typ: 'JWT', alg: 'ES256' };
  const payload = {
    aud,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: vapid.subject || 'mailto:support@retaindental.com',
  };
  const b64json = (o) => bytesToB64url(enc.encode(JSON.stringify(o)));
  const signingInput = `${b64json(header)}.${b64json(payload)}`;

  const pub = b64urlToBytes(vapid.publicKey);
  if (pub.length !== 65) throw new Error('VAPID public key must be a 65-byte uncompressed P-256 point');
  const jwk = {
    kty: 'EC', crv: 'P-256', ext: true,
    x: bytesToB64url(pub.slice(1, 33)),
    y: bytesToB64url(pub.slice(33, 65)),
    d: bytesToB64url(b64urlToBytes(vapid.privateKey)),
  };
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(signingInput)));
  const jwt = `${signingInput}.${bytesToB64url(sig)}`;
  return `vapid t=${jwt}, k=${vapid.publicKey}`;
}

export async function sendWebPush(subscription, payloadString, vapid) {
  const endpoint = subscription.endpoint;
  const uaPublic = b64urlToBytes(subscription.keys.p256dh);
  const authSecret = b64urlToBytes(subscription.keys.auth);

  // 1. Ephemeral key pair + ECDH shared secret
  const eph = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPublic = new Uint8Array(await crypto.subtle.exportKey('raw', eph.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', uaPublic, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, eph.privateKey, 256));

  // 2. Derive content encryption key + nonce (RFC 8291 §3.4)
  const authInfo = concat(enc.encode('WebPush: info'), new Uint8Array([0]), uaPublic, asPublic);
  const ikm = await hkdf(authSecret, shared, authInfo, 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, enc.encode('Content-Encoding: nonce\0'), 12);

  // 3. Encrypt the single record (payload + 0x02 delimiter)
  const record = concat(enc.encode(payloadString), new Uint8Array([2]));
  const aesKey = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce, tagLength: 128 }, aesKey, record));

  // 4. aes128gcm header: salt(16) || rs(4) || idlen(1) || keyid(65)
  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, 4096);
  const header = concat(salt, rs, new Uint8Array([asPublic.length]), asPublic);
  const body = concat(header, ciphertext);

  // 5. Send
  const authorization = await vapidAuthorization(endpoint, vapid);
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Encoding': 'aes128gcm',
      'Content-Type': 'application/octet-stream',
      TTL: '2419200',
      Urgency: 'normal',
    },
    body,
  });
  return { ok: res.ok, status: res.status, body: res.ok ? '' : await res.text().catch(() => '') };
}

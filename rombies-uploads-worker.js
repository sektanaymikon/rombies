// Paste this entire file into the Cloudflare Worker editor.
// Required R2 binding: UPLOADS -> rombies-sandbox.
// Uploads stay disabled until the sandbox client and database rules are ready.
const PROJECT_ID = 'rombies-86aa3';
const FIREBASE_WEB_API_KEY = 'AIzaSyCItSFqklQq5r1Eetdvfp3xzJUaWXMVXnI';
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_MUSIC_BYTES = 8 * 1024 * 1024;
const KINDS = new Set(['background', 'character', 'attack', 'obstacle', 'music']);
const TYPES = {'png': 'image/png', 'jpg': 'image/jpeg', 'webp': 'image/webp', 'gif': 'image/gif', 'mp3': 'audio/mpeg', 'ogg': 'audio/ogg', 'wav': 'audio/wav'};
const ASSET_PATH = /^\/assets\/([A-Za-z0-9_-]{1,128})\/([a-f0-9]{64})\.(png|jpg|webp|gif|mp3|ogg|wav)$/;

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function cors(request, env) {
  // ALLOWED_ORIGINS can later restrict browsers to the deployed game origins.
  // No cookies are used; uploads authenticate with a Firebase Bearer token.
  const allowed = (env.ALLOWED_ORIGINS || '*').split(',').map(x => x.trim());
  const origin = request.headers.get('Origin');
  if (origin && !allowed.includes('*') && !allowed.includes(origin)) {
    throw new HttpError(403, 'This game origin is not allowed.');
  }
  return {
    'Access-Control-Allow-Origin': allowed.includes('*') ? '*' : (origin || allowed[0]),
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, Range',
    'Access-Control-Expose-Headers': 'ETag, Content-Length, Content-Range, Accept-Ranges',
    'Access-Control-Max-Age': '3600',
    'X-Content-Type-Options': 'nosniff',
    'Vary': 'Origin'
  };
}

function json(value, status, headers) {
  return new Response(JSON.stringify(value), {
    status, headers: {...headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'}
  });
}

async function userId(request) {
  const token = request.headers.get('Authorization')?.match(/^Bearer ([A-Za-z0-9._-]+)$/)?.[1];
  if (!token || token.length > 8192) throw new HttpError(401, 'Sign in before uploading.');
  let claims;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    claims = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')), c => c.charCodeAt(0))));
  } catch (_) { throw new HttpError(401, 'Your login token is invalid.'); }
  const now = Date.now() / 1000;
  if (claims.aud !== PROJECT_ID || claims.iss !== `https://securetoken.google.com/${PROJECT_ID}` ||
      typeof claims.exp !== 'number' || claims.exp <= now ||
      typeof claims.iat !== 'number' || claims.iat > now ||
      typeof claims.sub !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(claims.sub)) {
    throw new HttpError(401, 'Refresh your login and try again.');
  }
  // Reading claims is not verification. Google validates the actual ID token here.
  let response;
  try {
    response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_WEB_API_KEY}`, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({idToken: token}), signal: AbortSignal.timeout(10000)
    });
  } catch (_) { throw new HttpError(503, 'Login verification is temporarily unavailable.'); }
  if (response.status >= 500 || response.status === 429) throw new HttpError(503, 'Login verification is temporarily unavailable.');
  if (!response.ok) throw new HttpError(401, 'Refresh your login and try again.');
  const account = (await response.json()).users?.[0];
  if (!account || account.localId !== claims.sub || account.disabled) {
    throw new HttpError(401, 'This account cannot upload.');
  }
  // Use the verified user's token: new rules permit reading their own ban status.
  // Fail closed if Firestore cannot verify moderation, including outdated rules.
  let ban;
  try { ban = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/bans/${encodeURIComponent(account.localId)}`, {
    headers: {Authorization: 'Bearer '+token}, signal: AbortSignal.timeout(10000)
  }); } catch (_) { throw new HttpError(503, 'Account moderation is temporarily unavailable.'); }
  if (ban.status !== 404) {
    if (!ban.ok) throw new HttpError(503, 'Account moderation could not be checked. Deploy the updated Firestore rules.');
    const active = (await ban.json()).fields?.active?.booleanValue;
    if (typeof active !== 'boolean') throw new HttpError(503, 'Invalid account moderation record.');
    if (active) throw new HttpError(403, 'This account is banned from online uploads.');
  }
  return account.localId;
}

async function imageBytes(request, kind) {
  const music=kind==='music',limit=music?MAX_MUSIC_BYTES:MAX_IMAGE_BYTES,message=music?'Music must fit within 8 MiB.':'Resize or shorten this image below 2 MiB.';
  const size = request.headers.get('Content-Length');
  if (size && Number(size) > limit) throw new HttpError(413, message);
  if (!request.body) throw new HttpError(400, 'Choose an image to upload.');
  const reader = request.body.getReader(), chunks = [];
  let length = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > limit) {
        await reader.cancel();
        throw new HttpError(413, message);
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  if (length < 12) throw new HttpError(415, 'Choose a PNG, JPEG, WebP, or GIF image.');
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  const starts = signature => signature.every((x, i) => bytes[i] === x);
  let ext;
  if (starts([137,80,78,71,13,10,26,10])) ext = 'png';
  else if (starts([255,216,255])) ext = 'jpg';
  else if (starts([82,73,70,70]) && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80) ext = 'webp';
  else if (starts([71,73,70,56,55,97]) || starts([71,73,70,56,57,97])) {
    ext = 'gif';
    const width = bytes[6] | bytes[7] << 8, height = bytes[8] | bytes[9] << 8;
    if (length < 13 || !width || !height || width > 4096 || height > 4096 || width * height > 4194304) {
      throw new HttpError(415, 'GIF dimensions must fit within 4 million pixels and 4096 pixels per side.');
    }
  }
  if (starts([73,68,51]) || (bytes[0]===255 && (bytes[1]&224)===224 && ext!=='jpg')) ext='mp3';
  else if(starts([79,103,103,83]))ext='ogg';
  else if(starts([82,73,70,70])&&String.fromCharCode(...bytes.slice(8,12))==='WAVE')ext='wav';
  if(music ? !['mp3','ogg','wav'].includes(ext) : ['mp3','ogg','wav'].includes(ext))throw new HttpError(415,music?'Choose MP3, OGG or WAV music.':'Choose image artwork for this upload.');
  if (!ext) throw new HttpError(415, 'Choose a PNG, JPEG, WebP, or GIF image.');
  const declared = request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase();
  if (declared !== TYPES[ext]) throw new HttpError(415, 'The image format does not match its content type.');
  return {bytes, ext};
}

export default {
  async fetch(request, env) {
    let headers = {'X-Content-Type-Options': 'nosniff'};
    try {
      headers = cors(request, env);
      if (request.method === 'OPTIONS') return new Response(null, {status: 204, headers});
      const url = new URL(request.url);
      if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
        if (!env.UPLOADS) throw new HttpError(503, 'Add the UPLOADS R2 bucket binding.');
        // A harmless read confirms that the deployed binding actually works.
        await env.UPLOADS.head('_rombies_connection_check');
        return json({ok: true, service: 'Rombies sandbox uploads', firebaseProject: PROJECT_ID,
          bucketConnected: true, uploadsEnabled: env.ENABLE_UPLOADS === 'true', moderationEnforced: true, maxImageBytes: MAX_IMAGE_BYTES, maxMusicBytes: MAX_MUSIC_BYTES, supportedTypes: Object.values(TYPES)}, 200, headers);
      }
      if (!env.UPLOADS) throw new HttpError(503, 'The image bucket is not connected.');
      const asset = url.pathname.match(ASSET_PATH);
      if (asset && (request.method === 'GET' || request.method === 'HEAD')) {
        const key = url.pathname.slice(1);
        const meta=await env.UPLOADS.head(key);if(!meta)throw new HttpError(404,'File not found.');
        const rawRange=request.headers.get('Range');let range=null;
        if(rawRange&&request.method==='GET'){
          const m=/^bytes=(\d*)-(\d*)$/.exec(rawRange);if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{...headers,'Content-Range':`bytes */${meta.size}`}});
          const start=m[1]?Number(m[1]):Math.max(0,meta.size-Number(m[2])),end=m[1]&&m[2]?Math.min(meta.size-1,Number(m[2])):meta.size-1;
          if(start>=meta.size||end<start)return new Response(null,{status:416,headers:{...headers,'Content-Range':`bytes */${meta.size}`}});range={offset:start,length:end-start+1};
        }
        const object=request.method==='HEAD'?meta:await env.UPLOADS.get(key,range?{range}:undefined);if(!object)throw new HttpError(404,'File not found.');
        return new Response(request.method==='HEAD'?null:object.body,{status:range?206:200,headers:{
          ...headers,'Content-Type':TYPES[asset[3]],'Content-Length':String(range?range.length:meta.size),'Accept-Ranges':'bytes',...(range?{'Content-Range':`bytes ${range.offset}-${range.offset+range.length-1}/${meta.size}`}:{ }),
          'ETag':meta.httpEtag,'Cache-Control':'public, max-age=86400','Cross-Origin-Resource-Policy':'cross-origin'
        }});
      }
      if (url.pathname === '/upload' && request.method === 'POST') {
        if (env.ENABLE_UPLOADS !== 'true') throw new HttpError(503, 'Sandbox uploads will open when the game setup is complete.');
        const kind = url.searchParams.get('kind');
        if (!KINDS.has(kind)) throw new HttpError(400, 'Choose background, character, attack, obstacle or music.');
        const uid = await userId(request);
        if (env.UPLOAD_RATE) {
          const {success} = await env.UPLOAD_RATE.limit({key: uid});
          if (!success) throw new HttpError(429, 'Too many uploads. Wait a minute and try again.');
        }
        const {bytes, ext} = await imageBytes(request,kind);
        const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(x => x.toString(16).padStart(2, '0')).join('');
        const key = `assets/${uid}/${hash}.${ext}`;
        if (!await env.UPLOADS.head(key)) {
          // A practical library limit; simultaneous requests may slightly exceed it.
          const library = await env.UPLOADS.list({prefix: `assets/${uid}/`, limit: 200});
          if (library.objects.length >= 200 || library.truncated) throw new HttpError(409, 'Your image library is full.');
          await env.UPLOADS.put(key, bytes, {
            httpMetadata: {contentType: TYPES[ext]},
            customMetadata: {owner: uid, kind, uploadedAt: new Date().toISOString()}
          });
        }
        return json({key, url: `${url.origin}/${key}`, bytes: bytes.byteLength, contentType: TYPES[ext], kind}, 201, headers);
      }
      throw new HttpError(asset || url.pathname === '/upload' ? 405 : 404, 'Route or method not found.');
    } catch (error) {
      return json({ok: false, error: error instanceof HttpError ? error.message : 'The upload service is temporarily unavailable.'},
        error instanceof HttpError ? error.status : 503, headers);
    }
  }
};

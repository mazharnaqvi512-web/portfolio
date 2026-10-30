/**
 * Serves the production build the way the static host does, so it can be
 * checked locally before uploading: `npm run build`, then `npm run serve:dist`.
 * Mirrors public/_redirects (/github -> the client shell) and 404.html with a
 * 404 status for unknown URLs.
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'my-app-21', 'browser');
const port = Number(process.env.PORT ?? 4400);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, file, status = 200) {
  res.writeHead(status, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
  if (path.includes('..')) {
    return send(res, join(root, '404.html'), 404);
  }
  const target = join(root, path);
  if (existsSync(target) && statSync(target).isFile()) {
    return send(res, target);
  }
  const indexFile = join(target, 'index.html');
  if (existsSync(indexFile)) {
    return send(res, indexFile);
  }
  if (path === 'github') {
    return send(res, join(root, 'index.csr.html'));
  }
  return send(res, join(root, '404.html'), 404);
}).listen(port, () => console.log(`Serving ${root} on http://localhost:${port}`));

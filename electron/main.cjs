/**
 * Joe4cast Desktop — Electron main process
 * ─────────────────────────────────────────────────────────
 * Lightweight shell:
 *   1. Serves the built frontend (dist/) from a local HTTP server
 *   2. Proxies backend paths exactly like the Vite dev server / Vercel:
 *        /api/v1/*          -> local Django (127.0.0.1:8000), falls back to Vercel
 *        /fanart-api/*      -> webservice.fanart.tv/v3/*
 *        /api/hf-inference/*-> router.huggingface.co/v1/*
 *        /api/groq-inference/* -> api.groq.com/openai/*
 *   3. Opens the app in a frameless-feel BrowserWindow
 * ─────────────────────────────────────────────────────────
 */

const { app, BrowserWindow, shell } = require('electron');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const HOST = '127.0.0.1';
const FIXED_PORT = 41730;

const VERCEL_BACKEND = 'https://joe4cast-stream.vercel.app';
const LOCAL_BACKEND = 'http://127.0.0.1:8000';

/* ── Proxy targets (mirrors vite.config.js + vercel.json) ── */
function urlTarget(kind, urlStr, rewritePath) {
    const u = new URL(urlStr);
    return {
        kind,
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port,
        host: u.host,
        search: u.search,
        rewritePath,
    };
}

function getProxyTarget(pathname) {
    if (pathname.startsWith('/api/v1')) return { kind: 'backend' };
    if (pathname.startsWith('/fanart-api')) {
        return {
            kind: 'fixed',
            target: new URL('https://webservice.fanart.tv/v3'),
            rewrite: pathname.replace(/^\/fanart-api/, ''),
        };
    }
    if (pathname.startsWith('/api/hf-inference')) {
        return {
            kind: 'fixed',
            target: new URL('https://router.huggingface.co/v1'),
            rewrite: pathname.replace(/^\/api\/hf-inference/, ''),
        };
    }
    if (pathname.startsWith('/api/groq-inference')) {
        return {
            kind: 'fixed',
            target: new URL('https://api.groq.com/openai'),
            rewrite: pathname.replace(/^\/api\/groq-inference/, ''),
        };
    }
    return null;
}

/* ── Buffered proxy with connection-error fallback chain ── */
function proxyRequest(req, res, targets) {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => tryTarget(req, res, targets, Buffer.concat(chunks), 0));
}

function tryTarget(req, res, targets, body, idx) {
    if (idx >= targets.length) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Backend unreachable' }));
        return;
    }
    const t = targets[idx];
    const mod = t.protocol === 'https:' ? https : http;
    const headers = { ...req.headers, host: t.host };
    delete headers.origin;
    delete headers.referer;
    if (body.length) headers['content-length'] = body.length;
    else delete headers['content-length'];

    const requestPath = t.kind === 'fixed'
        ? t.rewritePath + (t.search || '')
        : (t.rewritePath || req.url);

    const preq = mod.request(
        {
            protocol: t.protocol,
            hostname: t.hostname,
            port: t.port || (t.protocol === 'https:' ? 443 : 80),
            method: req.method,
            path: requestPath,
            headers,
        },
        (pres) => {
            res.writeHead(pres.statusCode || 502, pres.headers);
            pres.pipe(res);
        }
    );
    preq.setTimeout(30000, () => preq.destroy(new Error('ETIMEDOUT')));
    preq.on('error', (err) => {
        const retryable = ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN']
            .includes(err.code);
        if (retryable && idx < targets.length - 1) {
            tryTarget(req, res, targets, body, idx + 1);
        } else {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Backend unreachable', code: err.code }));
        }
    });
    if (body.length) preq.write(body);
    preq.end();
}

/* ── Static file serving with SPA fallback ── */
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.map': 'application/json',
    '.txt': 'text/plain',
    '.webmanifest': 'application/manifest+json',
    '.wasm': 'application/wasm',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
};

function serveFile(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
    // Required so Firebase auth popups can postMessage back to the opener
    headers['Cross-Origin-Opener-Policy'] = 'same-origin-allow-popups';
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
}

function handleStatic(req, res) {
    let pathname;
    try {
        pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    } catch {
        pathname = '/';
    }
    const safe = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    let filePath = path.join(DIST_DIR, safe);
    if (!filePath.startsWith(DIST_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(DIST_DIR, 'index.html'); // SPA fallback
    }
    serveFile(res, filePath);
}

/* ── Optional: auto-start local Django backend (source checkout only) ── */
function maybeStartBackend() {
    const repoRoot = path.join(__dirname, '..');
    const managePy = path.join(repoRoot, 'backend', 'manage.py');
    if (process.env.JOE4CAST_NO_BACKEND === '1' || !fs.existsSync(managePy)) return null;
    try {
        const py = process.platform === 'win32' ? 'python' : 'python3';
        const child = spawn(
            py,
            ['backend/manage.py', 'runserver', '127.0.0.1:8000', '--noreload'],
            { cwd: repoRoot, stdio: 'ignore', windowsHide: true }
        );
        child.on('error', () => {});
        app.on('quit', () => {
            try { child.kill(); } catch { /* already gone */ }
        });
        return child;
    } catch {
        return null;
    }
}

/* ── HTTP server ── */
function createServer() {
    return http.createServer((req, res) => {
        let pathname = '/';
        try {
            pathname = new URL(req.url, 'http://x').pathname;
        } catch { /* keep '/' */ }
        const target = getProxyTarget(pathname);
        if (target && req.url.startsWith('/api/v1')) {
            proxyRequest(req, res, [
                urlTarget('backend', LOCAL_BACKEND, req.url),
                urlTarget('backend', VERCEL_BACKEND, req.url),
            ]);
        } else if (target && target.kind === 'fixed') {
            proxyRequest(req, res, [urlTarget('fixed', target.target.href, target.rewrite)]);
        } else {
            handleStatic(req, res);
        }
    });
}

/* ── Window ── */
let mainWindow = null;

function createWindow(url) {
    mainWindow = new BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1024,
        minHeight: 640,
        backgroundColor: '#0b0d12',
        autoHideMenuBar: true,
        title: 'Joe4cast',
        icon: path.join(__dirname, '..', 'public', 'joe4cast.png'),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(url);

    // Firebase auth popups stay in-app; other external links go to the system browser
    mainWindow.webContents.setWindowOpenHandler(({ url: popupUrl }) => {
        if (/accounts\.google\.com|firebase|googleusercontent/i.test(popupUrl)) {
            return {
                action: 'allow',
                overrideBrowserWindowOptions: { autoHideMenuBar: true },
            };
        }
        shell.openExternal(popupUrl).catch(() => {});
        return { action: 'deny' };
    });

    mainWindow.on('closed', () => { mainWindow = null; });
}

/* ── App lifecycle ── */
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    app.whenReady().then(() => {
        maybeStartBackend();
        const start = (server) => {
            const { port } = server.address();
            createWindow(`http://${HOST}:${port}`);
        };
        const server = createServer();
        server.on('error', () => {
            // Fixed port taken -> let the OS pick a free one
            const fallback = createServer();
            fallback.listen(0, HOST, () => start(fallback));
        });
        server.listen(FIXED_PORT, HOST, () => start(server));
    });

    app.on('window-all-closed', () => {
        app.quit();
    });
}

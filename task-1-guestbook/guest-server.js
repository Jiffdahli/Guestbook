import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// JSON-Body parsen
app.use(express.json());

// simple request logger for debugging
app.use((req, _res, next) => {
    console.log('REQ', req.method, req.path);
    next();
});

// Statische Dateien ausliefern (Frontend)
app.use(express.static(path.join(__dirname, 'public')));
let entries = [];
// helper: safe id generator used for file-loaded entries and new posts
const makeIdGlobal = () => {
    try {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
            return crypto.randomUUID();
    }
    catch { }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};
// Try to load initial entries from Guestbook-task/files/data.json
try {
        const dataPath = path.join(__dirname, 'guestbook-files', 'data.json');
    if (fs.existsSync(dataPath)) {
        const raw = fs.readFileSync(dataPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.guests)) {
            entries = parsed.guests.map((g, idx) => ({
                id: makeIdGlobal(),
                name: String((g === null || g === void 0 ? void 0 : g.name) || `Guest ${idx + 1}`),
                msg: String((g === null || g === void 0 ? void 0 : g.message) || ''),
                time: Date.now() - (parsed.guests.length - idx) * 1000,
            }));
        }
    }
}
catch (err) {
    // eslint-disable-next-line no-console
    console.error('Could not load data.json:', (err && err.message) ? err.message : err);
}
// Helper: save current entries back to data.json (atomic write)
function saveEntriesToFile() {
    try {
    const dataPath = path.join(__dirname, 'guestbook-files', 'data.json');
        const tmpPath = dataPath + '.tmp';
        const payload = { guests: entries.map(e => ({ name: e.name, message: e.msg })) };
        fs.writeFileSync(tmpPath, JSON.stringify(payload, null, 2), 'utf8');
        fs.renameSync(tmpPath, dataPath);
        return true;
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to save data.json:', err);
        return false;
    }
}
// Api-Routen
app.get('/entries', (_req, res) => {
    res.json(entries.sort((a, b) => b.time - a.time));
});
app.post('/entries', (req, res) => {
    const { name, msg } = req.body ?? {};
    if (!name || !msg)
        return res.status(400).json({ error: 'Name und Comment Required' });
    const entry = { id: makeIdGlobal(), name: String(name), msg: String(msg), time: Date.now() };
    entries.push(entry);
    // persist to file; if it fails, still respond but log error
    const ok = saveEntriesToFile();
    if (!ok) {
        console.error('Warning: could not persist new entry to data.json');
    }
    res.status(201).json(entry);
});
// Fallback: index.html (für Direktaufruf / Reload)
// Fallback: serve index.html for any GET request that wasn't handled above.
app.use((req, res, next) => {
    if (req.method === 'GET') {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
        return;
    }
    next();
});

// start server (nachdem alle Routen/Middleware registriert sind)
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server ===> http://localhost:${PORT}`);
});
//# sourceMappingURL=guest-server.js.map
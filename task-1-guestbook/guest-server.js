import express from 'express';
import path from 'path';
import { fileURLToPath, resolve } from 'url';
const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// start server
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server ===> http://localhost:${PORT}`);
});
// JSON-Body parsen
app.use(express.json());
// Statische Dateien ausliefern (Frontend)
app.use(express.static(path.join(__dirname, 'public')));
let entries = [];
// Api-Routen
app.get('/entries', (_req, res) => {
    res.json(entries.sort((a, b) => b.time - a.time));
});
app.post('/entries', (req, res) => {
    const { name, msg } = req.body ?? {};
    if (!name || !msg)
        return res.status(400).json({ error: 'Name und Comment Required' });
    const entry = { id: crypto.randomUUID(), name, msg, time: Date.now() };
    entries.push(entry);
    res.status(201).json(entry);
});
// Fallback: index.html (für Direktaufruf / Reload)
app.use('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
//# sourceMappingURL=guest-server.js.map
import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath, resolve } from 'url';

const app: Express = express();
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

// "Datenbank" im  Speicher (einfach für Start)
type Entry = { id: string; name: string; msg: string; time: number };
let entries: Entry[] = [];

// Api-Routen
app.get('/entries', (_req: Request, res: Response) =>{
  res.json(entries.sort((a, b) => b.time - a.time));
});

app.post('/entries', (req: Request, res: Response) => {
  const { name, msg } = req.body ?? {};
  if (!name || !msg) return res.status(400).json({ error: 'Name und Comment Required' });
  const entry: Entry = { id: crypto.randomUUID(), name, msg, time: Date.now() };
  entries.push(entry);
  res.status(201).json(entry);
});

// Fallback: index.html (für Direktaufruf / Reload)
app.use('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


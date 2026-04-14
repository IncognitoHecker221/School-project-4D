import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  const FILENAME = 'baza_danych.json';

  if (req.method === 'GET') {
    try {
      // Pobieramy listę wszystkich plików w Blobe
      const { blobs } = await list();
      const myBlob = blobs.find(b => b.pathname === FILENAME);

      if (!myBlob) return res.status(200).json({ news: [], bans: {} });

      // Dodajemy ?t=, żeby ominąć pamięć podręczną (cache)
      const response = await fetch(myBlob.url + '?t=' + Date.now());
      const data = await response.json();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(200).json({ news: [], bans: {} });
    }
  }

  if (req.method === 'POST') {
    try {
      await put(FILENAME, JSON.stringify(req.body), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
      });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
}

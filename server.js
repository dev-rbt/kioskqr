const path = require('path');
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Statik dosyalar için
  server.use('/uploads', express.static(path.join(process.env.FILE_UPLOAD_DIR || process.cwd())));

  // Tüm Next.js istekleri için
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3010;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import { createRequire } from 'module';
import { createCertificate } from './src/certificate_create.js';
const require = createRequire(import.meta.url);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.post('/certificate-generate', createCertificate)

const PORT = 3000;

const server = http.createServer(app).listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

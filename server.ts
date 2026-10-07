import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { checkAllApis } from './apihealth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Basic server health
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 2. Full Data.gov.sg API health monitoring endpoint
app.get('/api/datagov/health', async (_req, res) => {
  try {
    const healthReport = await checkAllApis();
    res.json(healthReport);
  } catch (error) {
    res.status(500).json({
      systemStatus: 'DOWN',
      error: error instanceof Error ? error.message : 'Failed to monitor APIs',
      timestamp: new Date().toISOString(),
    });
  }
});

// 3. Live Data.gov.sg HDB Resale transactions proxy with caching/fallback
app.get('/api/datagov/resale', async (req, res) => {
  try {
    const { town, flat_type, limit = '20', offset = '0' } = req.query;
    const resourceId = 'd_8b84c4ee58e3cfc0ece0d773c8ca6abc';

    let apiUrl = `https://data.gov.sg/api/action/datastore_search?resource_id=${resourceId}&limit=${encodeURIComponent(
      String(limit)
    )}&offset=${encodeURIComponent(String(offset))}`;

    const filters: Record<string, string> = {};
    if (town && typeof town === 'string' && town !== 'all') {
      filters.town = town.toUpperCase();
    }
    if (flat_type && typeof flat_type === 'string' && flat_type !== 'all') {
      filters.flat_type = flat_type.toUpperCase();
    }

    if (Object.keys(filters).length > 0) {
      apiUrl += `&filters=${encodeURIComponent(JSON.stringify(filters))}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'UrbanCivicPrecision/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Data.gov.sg responded with HTTP ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Data.gov.sg transactions',
    });
  }
});

// 4. Live Data.gov.sg Dataset Metadata
app.get('/api/datagov/metadata', async (_req, res) => {
  try {
    const response = await fetch(
      'https://api-production.data.gov.sg/v2/public/api/datasets/d_8b84c4ee58e3cfc0ece0d773c8ca6abc/metadata',
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'UrbanCivicPrecision/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Metadata API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dataset metadata',
    });
  }
});

const isProduction =
  process.env.NODE_ENV === 'production' || fs.existsSync(path.resolve(__dirname, 'dist'));

if (isProduction) {
  // Serve built static assets in production
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  // Mount Vite middlewares in development
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});

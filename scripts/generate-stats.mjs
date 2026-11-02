import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getAnalytics } from '../src/services/analyticsService.js';
import { validateFeatureCollection } from '../src/utils/validators.js';

const inputPath = resolve(process.argv[2] || 'public/data/facilities.geojson');
const collection = JSON.parse(await readFile(inputPath, 'utf8'));
const { features, rejected } = validateFeatureCollection(collection);
const analytics = getAnalytics(features);
console.log(JSON.stringify({
  source: collection.metadata?.source ?? 'Unspecified',
  extractedAt: collection.metadata?.extractedAt ?? null,
  rejected,
  ...analytics,
}, null, 2));

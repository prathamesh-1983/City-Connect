import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { processElements, OVERPASS_QUERY, writeGeoJSON } from './lib/osm.mjs';

const endpoints = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.nchc.org.tw/api/interpreter',
];
let response;
let lastError;

for (const endpoint of endpoints) {
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'user-agent': 'CityConnect/1.0 (OpenStreetMap facility data extraction)',
      },
      body: new URLSearchParams({ data: OVERPASS_QUERY }),
      signal: AbortSignal.timeout(100000),
    });
    if (!response.ok) throw new Error(`${endpoint} returned HTTP ${response.status}`);
    break;
  } catch (error) {
    lastError = error;
    response = undefined;
  }
}

if (!response) {
  throw new Error(`OpenStreetMap extraction failed for all configured Overpass endpoints: ${lastError?.message ?? 'unknown network error'}`);
}

const rawText = await response.text();
let raw;
try {
  raw = JSON.parse(rawText);
} catch {
  throw new Error('Overpass returned a response that was not valid JSON.');
}
if (!Array.isArray(raw.elements)) {
  throw new Error('Overpass response is missing its elements array.');
}

const extractedAt = new Date().toISOString();
const collection = processElements(raw.elements, extractedAt);
await mkdir(resolve('data'), { recursive: true });
await writeFile(resolve('data/osm-raw.json'), `${JSON.stringify(raw)}\n`, 'utf8');
await writeGeoJSON(collection, resolve('public/data/facilities.geojson'));
console.log(`Processed ${collection.features.length} mapped facilities; excluded ${collection.metadata.rejectedCoordinates} invalid coordinates.`);
console.log(`GeoJSON: public/data/facilities.geojson (extracted ${extractedAt})`);
if (!collection.features.length) {
  console.warn('No matching facilities were returned. The empty dataset is explicitly marked as unverified.');
}

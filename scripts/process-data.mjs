import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { processElements, writeGeoJSON } from './lib/osm.mjs';

const inputPath = resolve(process.argv[2] || 'data/osm-raw.json');
const outputPath = resolve(process.argv[3] || 'public/data/facilities.geojson');
const rawText = await readFile(inputPath, 'utf8');
const raw = JSON.parse(rawText);
if (!Array.isArray(raw.elements)) {
  throw new Error(`Raw OSM input ${inputPath} must contain an elements array.`);
}

const collection = processElements(raw.elements, raw.osm3s?.timestamp_osm_base || new Date().toISOString());
await writeGeoJSON(collection, outputPath);
console.log(`Processed ${collection.features.length} facilities into ${outputPath}.`);

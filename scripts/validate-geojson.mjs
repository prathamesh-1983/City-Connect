import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { isValidCoordinatePair } from '../src/utils/validators.js';

const inputPath = resolve(process.argv[2] || 'public/data/facilities.geojson');
const collection = JSON.parse(await readFile(inputPath, 'utf8'));
if (collection.type !== 'FeatureCollection' || !Array.isArray(collection.features)) {
  throw new Error(`${inputPath} is not a GeoJSON FeatureCollection.`);
}

const invalid = [];
const ids = new Set();
collection.features.forEach((feature, index) => {
  if (feature?.type !== 'Feature' || feature.geometry?.type !== 'Point' ||
    !isValidCoordinatePair(feature.geometry.coordinates) || !feature.properties ||
    typeof feature.properties.id !== 'string' || !feature.properties.id ||
    typeof feature.properties.category !== 'string' || !feature.properties.category) {
    invalid.push(index);
    return;
  }
  if (ids.has(feature.properties.id)) invalid.push(index);
  ids.add(feature.properties.id);
});

if (invalid.length) {
  throw new Error(`Validation failed: ${invalid.length} invalid or duplicate feature(s) at array indices ${invalid.slice(0, 20).join(', ')}.`);
}
console.log(`Valid GeoJSON FeatureCollection: ${collection.features.length} features.`);

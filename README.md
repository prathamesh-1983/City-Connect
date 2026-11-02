# CityConnect — Navi Mumbai Location Intelligence

CityConnect is an interactive public-infrastructure explorer built with React, Vite, MapLibre GL JS and Amazon Location Service. It turns place-based data into a map that people can search, filter, inspect and understand.

> **Competition integrity note:** The included seed points are illustrative interface fixtures, not a verified inventory. Generate the OpenStreetMap GeoJSON dataset, inspect it, document its extraction date and limitations, and use that dataset in the submitted build. Do not claim sample/demo data is real or complete.

## What it does

- Interactive MapLibre map with clustered points
- Amazon Location Service map style when configured
- OpenStreetMap raster fallback for local UI development
- Search by facility name, category and area
- Category filters and color-coded markers
- Click a marker to inspect the place
- Summary cards and category distribution bars
- Browser geolocation and straight-line distance estimate
- Responsive layout for desktop and mobile
- OpenStreetMap extraction script and GeoJSON validation

## Stack

- React 18 + Vite
- MapLibre GL JS
- Amazon Location Service Maps API (API-key authentication)
- OpenStreetMap / Overpass API for the dataset
- AWS Amplify Hosting, or S3 + CloudFront for deployment

## 1. Prerequisites

Install:
- Node.js 20 LTS or later
- npm
- VS Code
- Git
- An AWS account for Amazon Location Service and AWS hosting

Check versions:

```bash
node -v
npm -v
git --version
```

## 2. Run locally

Open this folder in VS Code, then in the terminal:

```bash
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

Open the localhost URL printed by Vite, normally `http://localhost:5173`.

Without an AWS key, the app uses an OpenStreetMap raster basemap so the UI can be developed. This fallback is not the AWS integration required for the challenge.

## 3. Generate the real location dataset

The project includes an Overpass API extraction script. It requests OSM-tagged hospitals, clinics, schools, colleges, universities, libraries, parks, gardens, transit stops/stations, public services and sports facilities within an approximate Navi Mumbai study bounding box.

```bash
npm run data:osm
npm run check:data
```

The generated file is:

`public/data/navi-mumbai-facilities.geojson`

Then restart Vite or refresh the app. The app automatically loads this file when it exists.

### Dataset documentation to include in your submission

Record:
- Extraction date/time (inside the GeoJSON metadata)
- Source: OpenStreetMap contributors
- Query bounding box and included OSM tags
- Feature count from the generated metadata
- Limitations: OSM completeness varies; bounding box is approximate; category mapping is tag-based; coordinates and facility status should be verified for high-stakes use

Attribution: **© OpenStreetMap contributors** — https://www.openstreetmap.org/copyright  
License: Open Database License (ODbL) — https://opendatacommons.org/licenses/odbl/

Do not remove attribution. If you redistribute an adapted OSM database, review ODbL obligations.

## 4. Configure Amazon Location Service (required for AWS map mode)

The browser map uses the Amazon Location Maps API and MapLibre GL JS. Follow AWS's current console instructions; console labels may change.

1. Sign in to the AWS Console.
2. Open **Amazon Location Service**.
3. Create a map resource. Choose a supported style such as **Standard**.
4. Create an API key for the map resource. Grant only the map read actions needed by the application. Avoid broad permissions.
5. Restrict the key to the required map resource/actions and configure allowed origins/referrers if the console offers that option.
6. Copy the API key value once and keep it private while configuring.
7. Set the `.env` file:

```env
VITE_AWS_REGION=ap-south-1
VITE_AWS_LOCATION_API_KEY=YOUR_RESTRICTED_LOCATION_API_KEY
VITE_AWS_MAP_STYLE=Standard
VITE_AWS_MAP_STYLE_URL=
```

8. Restart Vite after changing `.env`.
9. The top-right map status should say **Amazon Location Service**. If it says OpenStreetMap demo mode, the key is missing or not loaded.
10. Check browser DevTools Network/Console if map tiles fail. Confirm region, map style, API key permissions, key restrictions and billing.

AWS docs:
- First map app: https://docs.aws.amazon.com/location/latest/developerguide/first-app.html
- Display a map: https://docs.aws.amazon.com/location/latest/developerguide/how-to-display-a-map.html
- API-key authentication: https://docs.aws.amazon.com/location/latest/developerguide/using-apikeys.html

### Security

A Vite `VITE_` variable is compiled into browser JavaScript. An Amazon Location API key used in a browser is therefore visible to visitors. It is not an AWS secret access key, but it must be restricted to the minimum map resources/actions and allowed origins where supported. Never put IAM access keys, secret keys, session tokens or database passwords in `.env` variables prefixed with `VITE_`.

For stronger production security, use a suitable identity/authentication flow and/or a backend proxy where appropriate. Rotate or revoke exposed keys.

## 5. Deploy on AWS Amplify Hosting

1. Push the project to a public GitHub repository.
2. Open https://console.aws.amazon.com/amplify/
3. Choose **New app → Host web app**.
4. Connect GitHub and authorize AWS Amplify.
5. Select the `cityconnect-navi-mumbai` repository and branch.
6. Configure build settings (the included `amplify.yml` is used automatically).
7. Add environment variables in Amplify app settings:
   - `VITE_AWS_REGION`
   - `VITE_AWS_LOCATION_API_KEY`
   - `VITE_AWS_MAP_STYLE`
   - `VITE_DATASET_LABEL`
8. Save and deploy.
9. Open the generated HTTPS URL in an incognito window and test map, filters, search and selected place details.
10. Keep the repository and deployed URL publicly accessible during judging.

## 6. Alternative deployment: S3 + CloudFront

Build:

```bash
npm run build
```

Upload the **contents** of `dist/` to an S3 bucket. For a safer public website, keep the bucket private and serve it through CloudFront with Origin Access Control. Configure the default root object as `index.html`. For a single-page app, configure an appropriate 403/404 fallback to `/index.html` with a 200 response if needed. Add the same Vite build-time environment variables before building; Vite values are baked into the bundle.

AWS guide: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.SimpleDistribution.html

## 7. GitHub setup

Create a new public repository named `cityconnect-navi-mumbai`.

```bash
git init
git add .
git commit -m "Build CityConnect location intelligence app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cityconnect-navi-mumbai.git
git push -u origin main
```

Before pushing:
- Ensure `.env` is ignored and is not tracked.
- Commit `.env.example`, not the real API key.
- Check `git status` and inspect staged files.
- Do not commit personal data or sensitive location data.

## 8. Pre-submission QA

- [ ] `npm install` completes
- [ ] `npm run data:osm` creates GeoJSON
- [ ] `npm run check:data` passes
- [ ] Real dataset attribution and limitations are documented
- [ ] AWS map mode works with restricted Amazon Location API key
- [ ] Search and every category filter work
- [ ] Markers cluster and expand
- [ ] Selected location card works
- [ ] Browser location permission works (HTTPS or localhost)
- [ ] Mobile layout is usable
- [ ] Production build succeeds (`npm run build`)
- [ ] Live app works in a private/incognito browser
- [ ] Public GitHub repository opens without login
- [ ] Public demo video is less than 3 minutes
- [ ] AWS service and dataset pipeline are explained in the project write-up

## 9. Demo narrative (under 3 minutes)

**0:00–0:20 — Problem:** Public facility information is fragmented. CityConnect makes place-based data explorable in one view.

**0:20–0:45 — Dataset:** Explain OpenStreetMap, the Overpass query, the extraction date, bounding box and data limitations.

**0:45–1:30 — Explore:** Search for a facility, filter categories, zoom into clusters and click a marker.

**1:30–2:00 — Insight:** Show category counts, area coverage and what the map reveals. Do not claim completeness or service quality from raw point counts.

**2:00–2:35 — AWS architecture:** Show Amazon Location Service serving the basemap, MapLibre rendering it, and the GeoJSON dataset extracted from OSM and hosted with the app.

**2:35–2:55 — Impact:** Explain how the reusable pipeline can be adapted for other cities and public datasets.

## 10. Honest project limitations / future work

- Current OSM extract is point-based; ways/relations use Overpass center coordinates.
- Category assignment is a transparent tag mapping, not a human-verified classification.
- The study bounding box is approximate and not a legal municipal boundary.
- OSM may omit, duplicate or contain stale facilities.
- Distance is straight-line distance, not walking/driving travel time.
- No live availability, emergency dispatch or official service-quality data is provided.

Future work: verified municipal datasets, routing and travel-time analysis, accessibility attributes, temporal change detection and a server-side ingestion pipeline.

## License

Application source: MIT (see LICENSE). OpenStreetMap data is separately licensed under ODbL and requires attribution. The two licenses are not interchangeable.

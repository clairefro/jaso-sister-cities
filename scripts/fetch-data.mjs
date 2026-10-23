import { mkdir, writeFile } from "node:fs/promises"

const { AIRTABLE_PAT, AIRTABLE_BASE_ID } = process.env
if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
  console.error("AIRTABLE_PAT and AIRTABLE_BASE_ID must be set")
  process.exit(1)
}

const TABLES = ["cities", "regions"]
const FIELDS = [
  "us_region",
  "us_region_j",
  "us_lon",
  "us_lat",
  "us_city_j",
  "us_city",
  "ja_region_j",
  "ja_region",
  "ja_lon",
  "ja_lat",
  "ja_city_j",
  "ja_city",
  "year_established",
  "en_links",
  "ja_links",
  "isInvalid",
  "isRegion",
]

async function fetchTable(table) {
  const records = []
  let offset
  do {
    const url = new URL(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
        table
      )}`
    )
    if (offset) url.searchParams.set("offset", offset)
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
    })
    if (!res.ok) {
      throw new Error(`Airtable ${table}: ${res.status} ${await res.text()}`)
    }
    const json = await res.json()
    records.push(...json.records)
    offset = json.offset
  } while (offset)
  return records
}

const rows = []
for (const table of TABLES) {
  for (const record of await fetchTable(table)) {
    // Missing fields are null, matching the old Gatsby GraphQL shape.
    const data = Object.fromEntries(
      FIELDS.map(f => [f, record.fields[f] ?? null])
    )
    rows.push({ data })
  }
}

await mkdir("src/data", { recursive: true })
await writeFile("src/data/map-data.json", JSON.stringify(rows))
console.log(`Wrote ${rows.length} records to src/data/map-data.json`)

import React from "react"

const Region = ({ data, type, flyTo, populateInfoBox, select, selected }) => {
  const thisRegion =
    type === "us"
      ? {
          name: data.us_region,
          name_j: data.us_region_j,
          coords: [data.us_lon, data.us_lat],
        }
      : {
          name: data.ja_region,
          name_j: data.ja_region_j,
          coords: [data.ja_lon, data.ja_lat],
        }
  const sisterRegion =
    type === "us"
      ? {
          name: data.ja_region,
          name_j: data.ja_region_j,
          coords: [data.ja_lon, data.ja_lat],
        }
      : {
          name: data.us_region,
          name_j: data.us_region_j,
          coords: [data.us_lon, data.us_lat],
        }

  const shared = {
    year_established: data.year_established,
    description: data.description,
    en_links: data.en_links,
    ja_links: data.ja_links,
  }

  const handleClick = () => {
    const info = {
      thisItem: thisRegion,
      sisterItem: sisterRegion,
      shared,
      isRegion: true,
    }
    select(data.us_region, data.ja_region)
    populateInfoBox(info)
  }
  return (
    <div
      onClick={handleClick}
      className={`region-marker ${selected ? "selected" : ""}`}
    >
      <div className="marker-name">
        <p>
          {thisRegion.name}/{sisterRegion.name}
        </p>
      </div>
    </div>
  )
}

export default Region

import React from "react"

const City = ({ data, type, flyTo, populateInfoBox, select, selected }) => {
  const thisCity =
    type === "us"
      ? {
          name: data.us_city,
          name_j: data.us_city_j,
          region: data.us_region,
          region_j: data.us_region_j,
          coords: [data.us_lon, data.us_lat],
        }
      : {
          name: data.ja_city,
          name_j: data.ja_city_j,
          region: data.ja_region,
          region_j: data.ja_region_j,
          coords: [data.ja_lon, data.ja_lat],
        }
  const sisterCity =
    type === "us"
      ? {
          name: data.ja_city,
          name_j: data.ja_city_j,
          region: data.ja_region,
          region_j: data.ja_region_j,
          coords: [data.ja_lon, data.ja_lat],
        }
      : {
          name: data.us_city,
          name_j: data.us_city_j,
          region: data.us_region,
          region_j: data.us_region_j,
          coords: [data.us_lon, data.us_lat],
        }

  const handleClick = () => {
    const info = { thisItem: thisCity, sisterItem: sisterCity }
    select(data.us_city, data.ja_city)
    populateInfoBox(info)
  }

  return (
    <div
      onClick={handleClick}
      className={`city-marker ${selected ? "selected" : null}`}
    >
      <div className="marker-name">
        <p>
          {thisCity.name}/{sisterCity.name}
        </p>
      </div>
    </div>
  )
}

export default City

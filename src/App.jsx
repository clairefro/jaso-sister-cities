import React, { useState, useRef } from "react"
import ReactMapboxGl, { Marker, GeoJSONLayer } from "react-mapbox-gl"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import "./styles/index.scss"
import mapDataJson from "./data/map-data.json"
import { arcCoordinates } from "./arc"

import City from "./components/city"
import Region from "./components/region"
import InfoBox from "./components/infoBox"
import Controls from "./components/controls"
import AdminDeploy from "./components/adminDeploy"

// react-mapbox-gl sets the token on an interop copy of mapbox-gl under Vite, so set it here.
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const Map = ReactMapboxGl({
  accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
})

const US_DEFAULT_CENTER = { coord: [-122.676483, 44.023064], zoom: 5.3 }
const JA_DEFAULT_CENTER = { coord: [139.839478, 35.652832], zoom: 4 }

export default function Home() {
  const [mapData] = useState(mapDataJson)
  const [center, setCenter] = useState(US_DEFAULT_CENTER.coord)
  const [zoom, setZoom] = useState(US_DEFAULT_CENTER.zoom)
  const [infoBoxData, setInfoBoxData] = useState(null)
  const [infoIsVisible, setInfoIsVisible] = useState(false)
  const [selected, setSelected] = useState(null)
  const mapRef = useRef()

  const flyTo = (coors, zm) => {
    closeInfoBox()
    mapRef.current.state.map.flyTo({
      center: coors,
      essential: true,
      zoom: zm || 5,
    })
  }

  const populateInfoBox = info => {
    setInfoBoxData(info)
    setInfoIsVisible(true)
  }
  const closeInfoBox = () => {
    setInfoIsVisible(false)
  }

  const onZoomEnd = () => {
    setZoom(mapRef.current.state.map.transform._zoom)
  }
  const onMoveEnd = () => {
    const { _center } = mapRef.current.state.map.transform
    setCenter([_center.lng, _center.lat])
  }

  const updateSelected = (usName, jaName) => {
    setSelected([usName, jaName])
  }

  const isSameArray = (arr1, arr2) => {
    if (!!!arr1 || !!!arr2) return false
    return arr1.toString() === arr2.toString()
  }

  const selectedPair =
    selected &&
    mapData.find(({ data: d }) =>
      d.isRegion === "true"
        ? isSameArray(selected, [d.us_region, d.ja_region])
        : isSameArray(selected, [d.us_city, d.ja_city])
    )
  const arcData = {
    type: "FeatureCollection",
    features: selectedPair
      ? [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: arcCoordinates(
                [selectedPair.data.us_lon, selectedPair.data.us_lat],
                [selectedPair.data.ja_lon, selectedPair.data.ja_lat]
              ),
            },
          },
        ]
      : [],
  }

  return (
    <>
      <div>
        <div className="container">
          <div className="map">
            {infoBoxData && (
              <InfoBox
                info={infoBoxData}
                infoIsVisible={infoIsVisible}
                closeInfoBox={closeInfoBox}
                flyTo={flyTo}
                type={!!infoBoxData.isRegion ? "region" : null}
              />
            )}
            <Controls
              flyTo={flyTo}
              jaCenter={JA_DEFAULT_CENTER}
              usCenter={US_DEFAULT_CENTER}
            />
            <AdminDeploy />

            <Map
              style="mapbox://styles/mapbox/streets-v11"
              containerStyle={{
                height: "100%",
                width: "100%",
              }}
              center={center}
              zoom={[zoom]}
              onMoveEnd={onMoveEnd}
              onZoomEnd={onZoomEnd}
              flyToOptions={{ speed: 0.8 }}
              ref={mapRef}
            >
              <GeoJSONLayer
                data={arcData}
                lineLayout={{ "line-cap": "round", "line-join": "round" }}
                linePaint={{
                  "line-color": "#888888",
                  "line-width": 3,
                  "line-dasharray": [0, 2],
                  "line-translate": [0, -6],
                }}
              />
              {/* cities */}
              {mapData
                .filter(d => !(d.data.isRegion === "true"))
                .map((d, i) => {
                  const city = d.data
                  const isInvalid =
                    city.isInvalid === "true" || city.isInvalid === undefined
                  if (isInvalid) return null

                  return (
                    <div className="city" key={i}>
                      <Marker
                        key={`${i}-city-us`}
                        coordinates={[city.us_lon, city.us_lat]}
                      >
                        <City
                          data={d.data}
                          flyTo={flyTo}
                          populateInfoBox={populateInfoBox}
                          type="us"
                          select={updateSelected}
                          selected={
                            isSameArray(selected, [city.us_city, city.ja_city])
                              ? "selected"
                              : null
                          }
                        ></City>
                      </Marker>
                    </div>
                  )
                })}
              {mapData
                .filter(d => !(d.data.isRegion === "true"))
                .map((d, i) => {
                  const city = d.data
                  const isInvalid =
                    city.isInvalid === "true" || city.isInvalid === undefined
                  if (isInvalid) return null
                  return (
                    <div className="city" key={i}>
                      <Marker
                        key={`${i}-city-ja`}
                        coordinates={[city.ja_lon, city.ja_lat]}
                      >
                        <City
                          data={d.data}
                          flyTo={flyTo}
                          populateInfoBox={populateInfoBox}
                          type="ja"
                          select={updateSelected}
                          selected={
                            isSameArray(selected, [city.us_city, city.ja_city])
                              ? "selected"
                              : null
                          }
                        ></City>
                      </Marker>
                    </div>
                  )
                })}
              {/* regions */}
              {mapData
                .filter(d => d.data.isRegion === "true")
                .map((d, i) => {
                  const region = d.data
                  const isInvalid =
                    region.isInvalid === "true" ||
                    region.isInvalid === undefined
                  if (isInvalid) return null
                  return (
                    <div className="region" key={i}>
                      <Marker
                        key={`${i}-region-us`}
                        coordinates={[region.us_lon, region.us_lat]}
                      >
                        <Region
                          data={d.data}
                          flyTo={flyTo}
                          populateInfoBox={populateInfoBox}
                          type="us"
                          select={updateSelected}
                          selected={
                            isSameArray(selected, [
                              region.us_region,
                              region.ja_region,
                            ])
                              ? "selected"
                              : null
                          }
                        ></Region>
                      </Marker>
                    </div>
                  )
                })}
              {mapData
                .filter(d => d.data.isRegion === "true")
                .map((d, i) => {
                  const region = d.data
                  const isInvalid =
                    region.isInvalid === "true" ||
                    region.isInvalid === undefined
                  if (isInvalid) return null
                  return (
                    <div className="region" key={i}>
                      <Marker
                        key={`${i}-region-ja`}
                        coordinates={[region.ja_lon, region.ja_lat]}
                      >
                        <Region
                          data={d.data}
                          flyTo={flyTo}
                          populateInfoBox={populateInfoBox}
                          type="ja"
                          select={updateSelected}
                          selected={
                            isSameArray(selected, [
                              region.us_region,
                              region.ja_region,
                            ])
                              ? "selected"
                              : null
                          }
                        ></Region>
                      </Marker>
                    </div>
                  )
                })}
            </Map>
          </div>
        </div>
      </div>
    </>
  )
}

// light style : mapbox://styles/mapbox/light-v10

// onStyleLoad={() =>
//   flyTo(US_DEFAULT_CENTER.coord, US_DEFAULT_CENTER.zoom)
// }

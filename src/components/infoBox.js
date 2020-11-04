import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import SVG from "react-inlinesvg"

import flag_us from "../../static/icons/flag-us.svg"
import flag_ja from "../../static/icons/flag-ja.svg"

const InfoBox = ({ info, flyTo, closeInfoBox, infoIsVisible, type }) => {
  const [curInfo, setCurInfo] = useState(info)

  useEffect(() => {
    setCurInfo(info)
  }, [info])

  if (!curInfo.thisItem) return null

  const handleFly = () => {
    flyTo(curInfo.sisterItem.coords, 8)
    switchCities()
  }

  const switchCities = () => {
    setCurInfo({
      thisItem: curInfo.sisterItem,
      sisterItem: curInfo.thisItem,
      shared: curInfo.shared,
    })
  }

  const linksToArray = linkStr => {
    if (!!!linkStr) return []
    return linkStr.replace(/\s/, "").split("|")
  }

  const getLinksByLang = lang_link => {
    return curInfo.shared && curInfo.shared[lang_link]
      ? linksToArray(curInfo.shared[lang_link])
      : []
  }
  const en_links = getLinksByLang("en_links")
  const ja_links = getLinksByLang("ja_links")

  const titleInfo_us_layout =
    type === "region" ? (
      <>
        <h2>
          {curInfo.thisItem.name} / {curInfo.sisterItem.name}
        </h2>
        <h2>
          {curInfo.thisItem.name_j} / {curInfo.sisterItem.name_j}
        </h2>
      </>
    ) : (
      <>
        <h2>
          {curInfo.thisItem.name}, {curInfo.thisItem.region} /{" "}
          {curInfo.sisterItem.name}, {curInfo.sisterItem.region}
        </h2>
        <h2>
          {curInfo.thisItem.region_j}
          {curInfo.thisItem.name_j} / {curInfo.sisterItem.region_j}
          {curInfo.sisterItem.name_j}
        </h2>
      </>
    )

  const titleInfo_ja_layout =
    type === "region" ? (
      <>
        <h2>
          {curInfo.thisItem.name_j} / {curInfo.sisterItem.name_j}
        </h2>
        <h2>
          {curInfo.thisItem.name} / {curInfo.sisterItem.name}
        </h2>
      </>
    ) : (
      <>
        <h2>
          {curInfo.thisItem.region_j}
          {curInfo.thisItem.name_j} / {curInfo.sisterItem.region_j}
          {curInfo.sisterItem.name_j}
        </h2>
        <h2>
          {curInfo.thisItem.name}, {curInfo.thisItem.region} /{" "}
          {curInfo.sisterItem.name}, {curInfo.sisterItem.region}
        </h2>
      </>
    )

  const prettyUrl = url => {
    const matches = url.match(/(?:https?:\/\/)?(?:www\.)?([\w\d-_]+\.\w+)/)
    // to account for extremely odd urls like Yoshikawa gov url, fallback to ugly url
    return matches ? matches[1] : url
  }

  const LinkItem = ({ link, flagSrc }) => (
    <div className="link-item dont-break-out">
      <SVG src={flagSrc} />
      <a href={link} target="_blank" rel="noreferrer noopener">
        {prettyUrl(link)}
      </a>
    </div>
  )

  const links_us_layout = (
    <>
      <div className="info-links">
        {en_links.map((l, i) => (
          <LinkItem key={i} flagSrc={flag_us} link={l} />
        ))}
      </div>
      <div className="info-links">
        {ja_links.map((l, i) => (
          <LinkItem key={i} flagSrc={flag_ja} link={l} />
        ))}
      </div>
    </>
  )
  const links_ja_layout = (
    <>
      <div className="info-links">
        {ja_links.map((l, i) => (
          <LinkItem key={i} flagSrc={flag_ja} link={l} />
        ))}
      </div>
      <div className="info-links">
        {en_links.map((l, i) => (
          <LinkItem key={i} flagSrc={flag_us} link={l} />
        ))}
      </div>
    </>
  )

  const fly_button_us_layout = (
    <button onClick={handleFly}>
      Fly to {curInfo.sisterItem.name} <br />
      {curInfo.sisterItem.name_j}へ飛ぶ
    </button>
  )
  const fly_button_ja_layout = (
    <button onClick={handleFly}>
      {curInfo.sisterItem.name_j}へ飛ぶ
      <br /> Fly to {curInfo.sisterItem.name}
    </button>
  )

  return (
    <div
      className="info-box"
      style={{
        display: infoIsVisible ? "flex" : "none",
      }}
    >
      <button onClick={closeInfoBox} className="info-close">
        X
      </button>
      {curInfo.thisItem.layout === "us" ? (
        <div className="info-title">{titleInfo_us_layout}</div>
      ) : (
        <div className="info-title">{titleInfo_ja_layout}</div>
      )}

      {curInfo.shared.year_established && (
        <p className="info-established">
          Established {curInfo.shared.year_established}年提携
        </p>
      )}

      {curInfo.thisItem.layout === "us" ? links_us_layout : links_ja_layout}
      <br />
      {curInfo.thisItem.layout === "us"
        ? fly_button_us_layout
        : fly_button_ja_layout}
    </div>
  )
}

InfoBox.propTypes = {
  thisCity: PropTypes.shape({
    name: PropTypes.string.isRequired,
    name_j: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    region_j: PropTypes.string.isRequired,
    coords: PropTypes.arrayOf(PropTypes.number).isRequired,
    layout: PropTypes.oneOf(["ja", "us"]).isRequired,
  }),
  sisterCity: PropTypes.shape({
    name: PropTypes.string.isRequired,
    name_j: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    region_j: PropTypes.string.isRequired,
    coords: PropTypes.arrayOf(PropTypes.number).isRequired,
    layout: PropTypes.oneOf(["ja", "us"]).isRequired,
  }),
}

export default InfoBox

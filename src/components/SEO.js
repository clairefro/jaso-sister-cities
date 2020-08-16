import React from "react"
import { Helmet } from "react-helmet-async"
import ogImage from "../../static/og/card.png"

const SEO = () => {
  const canonical = "https://jaso-sister-cities.netlify.app/"

  const defaults = {
    title: "JASO Sister Cities Map | オレゴン日米協会姉妹都市マップ",
    description: `Discover connections between Japan and Oregon/SW Washington. 日本とオレゴン州・西南ワシントン州間のつながりを発見する`,
    keywords: [
      "JASO",
      "sister cities",
      "Japan",
      "Oregon",
      "Washington",
      "オレゴン日米協会",
      "姉妹都市",
      "日本",
      "オレゴン",
      "ワシントン",
    ],
    meta: [
      {
        name: "viewport",
        content: "width=device-width",
      },
    ],
    link: [
      {
        rel: "canonical",
        href: canonical,
      },
    ],
    // OG defaults
    og: {
      title: "JASO Sister Cities Map | オレゴン日米協会姉妹都市マップ",
      description: `Discover connections between Japan and Oregon/SW Washington. 日本とオレゴン州・西南ワシントン州間のつながりを発見する`,
      url: canonical,
      type: "website",
      image: ogImage,
    },
  }

  return (
    <Helmet
      title={defaults.title}
      description={defaults.description}
      link={[...defaults.link]}
      meta={[...defaults.meta]
        // site description
        .concat([
          {
            name: "description",
            content: defaults.description,
          },
          {
            name: "keywords",
            content: defaults.keywords.join(","),
          },
        ])
        // FB OG data
        .concat([
          {
            property: "og:title",
            content: defaults.og.title,
          },
          {
            property: "og:description",
            content: defaults.og.description,
          },
          {
            property: "og:url",
            content: defaults.og.url,
          },
          {
            property: "og:type",
            content: defaults.og.type,
          },
          {
            property: "og:image",
            content: defaults.og.image,
          },
          {
            property: "og:image:width",
            content: 800,
          },
          {
            property: "og:image:height",
            content: 600,
          },
        ])
        // Twitter og data mirrors fb og data
        .concat([
          {
            property: "twitter:card",
            content: "summary_large_image",
          },
          {
            property: "twitter:title",
            content: defaults.og.title,
          },
          {
            property: "twitter:description",
            content: defaults.og.description,
          },
          {
            property: "twitter:image",
            content: defaults.og.image,
          },
        ])}
    >
      <html
        lang="en"
        xmlns="http://www.w3.org/1999/xhtml"
        prefix="og: http://ogp.me/ns# fb: http://www.facebook.com/2008/fbml"
      />
    </Helmet>
  )
}

export default SEO

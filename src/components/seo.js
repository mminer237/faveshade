import React from "react"
import { useStaticQuery, graphql } from 'gatsby'
import { Helmet } from "react-helmet"

export default function Seo({ description, title }) {
	const { site } = useStaticQuery(graphql`
		query HeaderQuery {
			site {
				siteMetadata {
					title
				}
			}
		}
	`)

	return (
		<Helmet>
			<title>{(title ? `${title} – ` : "") + site.siteMetadata.title}</title>
			{description ? <meta name="description" content={description} /> : ""}
		</Helmet>
	)
}
import React from "react"
import { Helmet } from "react-helmet"
import { Link } from "gatsby"
import "./style.scss"
import Seo from "../components/seo"
import { siteMetadata } from "../../gatsby-config"

export default function Layout({ children, description, title, extra = null}) {
	return (
		<>
			<Seo description={description} title={title} />
			<Helmet>
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color={siteMetadata.themeColor} />
				<meta name="msapplication-TileColor" content={siteMetadata.themeColor} />
				<meta name="theme-color" content={siteMetadata.themeColor} />
				{extra}
			</Helmet>
			<header>
				<Link to="/">
					<h1><span className="fave">Fave</span><span className="shade">Shade<sup>™</sup></span></h1>
				</Link>
			</header>
			{children}
			<footer><div>Made by <a href="https://matthewminer.name">Matthew Miner</a></div></footer>
		</>
	)
}
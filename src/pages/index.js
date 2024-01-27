import * as React from "react"
import Layout from "../components/layout"
import '@simonwep/pickr/dist/themes/classic.min.css';
import Pickr from '@simonwep/pickr';
import betaincinv from '@stdlib/math-base-special-betaincinv';

const IndexPage = () => {
	return (
		<Layout
			description="Trying to pick your favorite colors or your ideal color for a layout? Use FaveShade to get the perfect shade for you!"
			extra={<script src="/js/main.js" />}
		>
			<section>
				<noscript><div className="error">Sorry, this site requires that JavaScript be enabled to function properly.</div></noscript>
				<div className="split">
					<div className="big">
						<div className="header-with-button">
							<h2>Color</h2>
							<button id="new-color">Randomize</button>
						</div>
						<div id="main-container">
							<div className="color-picker" id="main-color-picker"></div>
							<div className="header-with-button">
								<h3>Alternate Colors</h3>
								<button id="refresh-alts">Refresh</button>
							</div>
							<div id="alts-container">
								<alt-color></alt-color>
								<alt-color></alt-color>
								<alt-color></alt-color>
								<alt-color></alt-color>
								<alt-color></alt-color>
							</div>
						</div>
					</div>
					<div>
						<h2>Background Color</h2>
						<div className="color-picker opaque" data-default="#353535" id="background-color-picker"></div>
					</div>
				</div>
				<div className="subsection">
					<h2>Preview</h2>
					<div id="preview">
						<h3>
							<svg id="preview-logo" viewBox="0 0 312 100" xmlns="http://www.w3.org/2000/svg">
								<rect id="square" width="100" height="100" />
								<circle id="circle" r="50" cx="158" cy="50" />
								<polygon id="triangle" points="253.7,0 311.47,100 196,100" />
							</svg>
							Lorem Ipsum
						</h3>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
					</div>
				</div>
			</section>
		</Layout>
	)
}

export default IndexPage

const themeColor = "#8308e0";
module.exports = {
	siteMetadata: {
		siteUrl: "https://faveshade.com",
		title: "FaveShade",
		themeColor: themeColor,
	},
	plugins: [
		{
			resolve: "gatsby-plugin-manifest",
			options: {
				name: "FaveShade",
				short_name: "FaveShade",
				start_url: "/",
				background_color: "#353535",
				theme_color: themeColor,
				display: "browser",
				icon: "src/images/logo.svg",
			}
		},
		"gatsby-plugin-netlify",
		"gatsby-plugin-react-helmet",
		{
		  resolve: "gatsby-plugin-sass",
		  options: {
			additionalData: `$theme-color: ${themeColor};`
		  }
		},
		"gatsby-plugin-sitemap",
	],
  };
  
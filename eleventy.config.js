const faviconsPlugin = require("eleventy-plugin-gen-favicons");
const xmlFiltersPlugin = require('eleventy-xml-plugin');
const yaml = require('js-yaml');
const { createFsFromVolume, Volume } = require('memfs');
const sass = require("sass");
const webpack = require('webpack');

module.exports = (config) => {
	config.addPlugin(faviconsPlugin, {
		appleIconPadding: 0,
		manifestData: {
			name: "FaveShade",
			short_name: "FaveShade",
			theme_color: "#8308E0"
		}
	});
	config.addPlugin(xmlFiltersPlugin);

	config.addTemplateFormats(['js', 'scss', 'sass']);

	config.addExtension('js', {
		outputFileExtension: 'js',
		compile: async (content, inputPath) => {
			const memfs = createFsFromVolume(new Volume());
			const compiler = webpack({
				mode: 'production',
				entry: inputPath,
				output: {
					path: '/',
					filename: 'output',
				},
				module: {
					rules: [
						{
							test: /\.(js|jsx)$/i,
							loader: 'babel-loader',
						},
						{
							test: /\.(s[ca]ss)$/i,
							use: [
								'style-loader',
								'css-loader',
								'sass-loader',
							],
						},
					],
				},
			});
			compiler.outputFileSystem = memfs;
			const result = await new Promise((resolve, reject) => {
				compiler.run((err, stats) => {
					if (err) {
						reject(err);
					}
					else {
						resolve(stats);
					}
				});
			});
			if (result.hasErrors()) {
				throw new Error(result.toString());
			}
			return async (data) => memfs.readFileSync('/output');
		}
	});

	config.addExtension('scss', {
		outputFileExtension: 'css',
		compile: async function(inputContent) {
			let result = sass.compileString(inputContent);

			return async (data) => {
				return result.css;
			};
		  }
	});
	config.addExtension('sass', {
		key: 'scss',
	});

	config.addDataExtension('yml, yaml', (contents) => yaml.load(contents));

	config.addPassthroughCopy('src/assets');

	return {
		dir: {
			input: 'src',
			output: '_site',
		},
	};
};
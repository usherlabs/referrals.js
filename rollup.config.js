import path from "path";
// import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
import { uglify } from "rollup-plugin-uglify";
import filesize from "rollup-plugin-filesize";
import visualizer from "rollup-plugin-visualizer";
import injectProcessEnv from "rollup-plugin-inject-process-env";
// import sourcemaps from "rollup-plugin-sourcemaps";
import alias from "@rollup/plugin-alias";
import dotenv from "@gedhean/rollup-plugin-dotenv";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-polyfill-node";

import pkg from "./package.json";

const isProd = process.env.NODE_ENV === "production";

const input = "src/index.ts";
const extensions = [".ts", ".js", ".json"];
const codes = [
	"THIS_IS_UNDEFINED",
	"MISSING_GLOBAL_NAME",
	"CIRCULAR_DEPENDENCY"
];
const minifyExtension = (pathToFile) => pathToFile.replace(/\.js$/, ".min.js");
const discardWarning = (warning) => {
	if (codes.includes(warning.code)) {
		return;
	}

	console.error(warning);
};

const plugins = [
	esbuild({
		include: /\.ts?$/,
		exclude: /node_modules/,
		sourceMap: !isProd,
		minify: isProd,
		tsconfig: "./tsconfig.json",
		loaders: {
			// Add .json files support
			".json": "json"
		}
	}),
	commonjs(),
	json(),
	nodePolyfills({ include: ["crypto"] }),
	alias({
		entries: [{ find: "@", replacement: path.resolve(__dirname, "./src") }]
	}),
	external(),
	resolve({
		browser: true,
		extensions,
		preferBuiltins: false
	}),
	filesize(),
	visualizer(),
	dotenv(),
	injectProcessEnv({
		NODE_ENV: process.env.NODE_ENV || "development"
	})
];
// if (!isProd) {
// 	plugins.push(sourcemaps());
// }

export default [
	// CommonJS
	{
		output: {
			file: pkg.main,
			format: "cjs",
			exports: "named"
		},
		plugins
	},
	{
		output: {
			file: minifyExtension(pkg.main),
			format: "cjs",
			exports: "named"
		},
		plugins: [...plugins, uglify()]
	},

	// UMD
	{
		output: {
			file: pkg.browser,
			format: "umd",
			name: "usher",
			esModule: false,
			exports: "named"
		},
		plugins
	},
	{
		output: {
			file: minifyExtension(pkg.browser),
			format: "umd",
			name: "usher",
			esModule: false,
			exports: "named"
		},
		plugins: [...plugins, terser()]
	},

	// ES
	{
		output: {
			file: pkg.module,
			format: "es",
			exports: "named"
		},
		plugins
	},
	{
		output: {
			file: minifyExtension(pkg.module),
			format: "es",
			exports: "named"
		},
		plugins: [...plugins, terser()]
	}
].map((conf) => ({
	input,
	onwarn: discardWarning,
	treeshake: true,
	...conf
}));

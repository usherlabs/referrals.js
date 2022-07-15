/* eslint-disable no-console */

export const isProd = process.env.NODE_ENV === "production";

export const apiUrl = process.env.API_URL;
export const stagingApiUrl = process.env.STAGING_API_URL;

if (!apiUrl) {
	console.log(`[USHER] ERROR: No API Url loaded!`);
	throw new Error("Required environment variables not found");
}

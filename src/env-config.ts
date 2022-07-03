export const isProd = process.env.NODE_ENV === "production";

export const apiUrl = process.env.API_URL;
export const satelliteUrl = process.env.SATELLITE_URL;

if (!apiUrl) {
	/* eslint-disable no-console */
	console.log(`[USHER] ERROR: No API Url loaded!`);
}
if (!satelliteUrl) {
	/* eslint-disable no-console */
	console.log(`[USHER] ERROR: No Satellite Url loaded!`);
}
if (!satelliteUrl || !apiUrl) {
	throw new Error("Required environment variables not found");
}

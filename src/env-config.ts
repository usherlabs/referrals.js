export const isProd = process.env.NODE_ENV === "production";

export const satelliteUrl = process.env.SATELLITE_URL;

if (!satelliteUrl) {
	/* eslint-disable no-console */
	console.log(`[USHER] ERROR: No Satellite Url loaded!`);
}
if (!satelliteUrl) {
	throw new Error("Required environment variables not found");
}

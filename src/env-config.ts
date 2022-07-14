/* eslint-disable no-console */

export const isProd = process.env.NODE_ENV === "production";

export const satelliteUrl = process.env.SATELLITE_URL;
export const stagingSatelliteUrl = process.env.STAGING_SATELLITE_URL;

if (!satelliteUrl) {
	console.log(`[USHER] ERROR: No Satellite Url loaded!`);
	throw new Error("Required environment variables not found");
}

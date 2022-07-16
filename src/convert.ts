import { Conversion } from "@/types";
import { fromString } from "uint8arrays";
import { DID } from "dids";
import { getResolver as getKeyResolver } from "key-did-resolver";
import { Ed25519Provider } from "key-did-provider-ed25519";
import ky from "ky-universal";
import { Base64 } from "js-base64";

import { randomString } from "./utils";
import Token from "./token";
import Referred from "./referred";
import Configure from "./configure";

export const convert = async (conversion: Conversion) => {
	console.log("[USHER]", conversion);

	const ref = {
		id: conversion.id,
		chain: conversion.chain
	};

	const token = Token.next(ref);

	if (!token) {
		console.error(`[USHER] No token received from a valid referral`);
		return;
	}

	if (
		!conversion.id ||
		!conversion.chain ||
		typeof conversion.eventId !== "number"
	) {
		console.error(
			`[USHER] Campaign 'id', 'chain' and 'eventId' must be specified to track a conversion`
		);
		return;
	}

	try {
		// Authenticate a DID
		const entropy = fromString(Referred.id());
		const did = new DID({
			// Get the DID provider from the 3ID Connect instance
			provider: new Ed25519Provider(entropy),
			resolver: getKeyResolver()
		});
		await did.authenticate();

		// Produce the DID Auth Token
		const nonce = randomString(32);
		const sig = await did.createJWS(nonce, { did: did.id });
		const raw = [[did.id, sig]];
		const authToken = Base64.encode(JSON.stringify(raw));

		const request = ky.create({
			prefix: `${Configure.getApiUrl()}/api`,
			headers: {
				Authorization: `Bearer ${authToken}`
			}
		});

		// Start the conversion using the referral token
		// ? Here we fetch the Usher Network Signature verifying the referral
		const response: { success: boolean; data: { code: string } } = await request
			.get(
				`conversions?id=${conversion.id}&chain=${conversion.chain}&token=${token}`
			)
			.json();
		if (!response.success) {
			throw new Error(
				"Failed to convert start conversion using referral token"
			);
		}

		const { code } = response.data;

		// ? This code will eventually be replaced with syndication of data to the decentralised DPK validator network
		const saveResponse: {
			success: boolean;
			data: { conversion: string; partnership: string };
			message?: string;
		} = await request
			.post("conversions", {
				json: {
					code,
					...conversion
				}
			})
			.json();

		if (!saveResponse.success) {
			throw new Error(`Could not save conversion: ${saveResponse.message}`);
		}

		// Destroy the key on success
		Token.remove(token);
	} catch (e) {
		if (typeof window !== "undefined") {
			console.error(`[USHER]`, e);
		} else {
			throw e;
		}
	}
};

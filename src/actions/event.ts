/**
 * The Event action that triggers a conversion tracking
 *
 * 1. Use the API_URL from the Env
 * 2. Fetch usher affiliate conversion id from the satellite
 * 3. Post the id and event to the api
 */

import ky from "ky";
import cuid from "cuid";
import { Sha256 } from "@aws-crypto/sha256-js";
import { fromString } from "uint8arrays";
import { DID } from "dids";
import { getResolver as getKeyResolver } from "key-did-resolver";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { Base64 } from "js-base64";

import { randomString } from "@/utils/random";
import { apiUrl } from "@/env-config";
import bus from "@/utils/bus";
import Satellite from "@/utils/satellite";
import { Conversion } from "@/types";

// Eventually -- we will enable wallet authentication so that the same wallet can be registered as the same referred user.

const action = async (conversion: Conversion) => {
	if (!Satellite.isLoaded()) {
		await Satellite.load();
	}

	// Received the cid (Conversion ID)
	bus.on("conversion", async (busParams) => {
		const { token, visitorId } = busParams as {
			token: string;
			visitorId?: string;
		};

		if (!token) {
			console.log(`[USHER] No token received from a valid referral`);
			return;
		}
		if (!conversion.id || !conversion.chain || !conversion.eventId) {
			console.log(
				`[USHER] Campaign 'id', 'chain' and 'eventId' must be specified to track a conversion`
			);
			return;
		}

		// Authenticate a DID
		let entropy = new Uint8Array();
		if (visitorId) {
			const hash = new Sha256();
			hash.update(visitorId);
			entropy = await hash.digest();
		} else {
			entropy = fromString([cuid(), randomString(6)].join("_"));
		}

		const did = new DID({
			// Get the DID provider from the 3ID Connect instance
			provider: new Ed25519Provider(entropy),
			resolver: getKeyResolver()
		});
		await did.authenticate();

		// Produce the DID Auth Token
		const nonce = randomString(32);
		const sig = await did.createJWS(nonce, { did: did.id });
		const raw = [did.id, sig];
		const authToken = Base64.encode(JSON.stringify(raw));

		const request = ky.create({
			prefixUrl: apiUrl,
			headers: {
				Authorization: `Bearer ${authToken}`
			}
		});

		// Start the conversion using the referral token
		const response: { success: boolean; data: { code: string } } = await request
			.get(
				`conversions?id=${conversion.id}&chain=${conversion.chain}&token=${token}`
			)
			.json();
		if (!response.success) {
			console.log(
				"[USHER] Failed to convert start conversion using referral token"
			);
			return;
		}

		const { code } = response.data;

		// This part will eventually be replaced with a syndication of data to the decentralised DPK network
		const saveResponse: { success: boolean; message?: string } = await request
			.post("conversions", {
				json: {
					code,
					...conversion
				}
			})
			.json();

		if (!saveResponse.success) {
			console.log(
				`[USHER] Could not save conversion: ${saveResponse.message || ""}`
			);
			return;
		}

		bus.emit("consume");
	});

	bus.emit("ping");
};

export default action;

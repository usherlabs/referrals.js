import { TOKEN_STORE_NAME, TOKEN_EXPIRY } from "./constants";
import { CampaignConflictStrategy } from "./types";
import lscache from "lscache";
import { Base64 } from "js-base64";
import { TOKEN_NAME } from "@/constants";
import Configure from "./configure";

class Token {
	private static _tokens = [];

	/**
	 * Get Primary Token
	 */
	public static get() {}

	/**
	 * Parse the existing Query Parameters or provided URL
	 */
	public static parse(url?: string) {
		if (!url && typeof window !== "undefined") {
			url = window.location.href;
		}

		if (!url) {
			return;
		}

		const urlInstance = new URL(url);
		let token = urlInstance.searchParams.get("_ushrt");

		if (typeof window === "undefined") {
			return token;
		}

		// Use the local storage to manage the cache
		lscache.flushExpired();

		if (!token) {
			// Check store to determine if there's a token to use.
			const store = lscache.get(TOKEN_STORE_NAME);
			const currentTime = Date.now();
			const newStore = store.filter(
				(s) => s[1] < currentTime + TOKEN_EXPIRY * 60 * 1000
			);
			newStore.sort((a, b) => {
				return a[1] - b[1];
			});
			token = newStore.unshift();
			lscache.set(TOKEN_STORE_NAME, newStore, TOKEN_EXPIRY);
		}

		if (!token) {
			return null;
		}

		let useToken = token;

		const [cToken, rToken] = token.split(".");
		const mainKey = [TOKEN_NAME, cToken].join(".");
		// We can use the campaign token to determine if there is an existing token for the given campaign.
		// If there is, and the conflictStrategy is not OVERWRITE, then put the current token into a store using lscache where the rToken (since unique) is the key
		const existingToken = lscache.get(mainKey);
		let campaign;
		const dec = Base64.decode(cToken).split(":");
		if (dec.length === 2) {
			campaign = {
				chain: dec[0],
				address: dec[1]
			};
		} else {
			return;
		}
		if (existingToken) {
			let campaignFromExisting;
			const existingDec = Base64.decode(cToken).split(":");
			if (existingDec.length === 2) {
				campaignFromExisting = {
					chain: dec[0],
					address: dec[1]
				};
			}
			if (
				campaign.address === campaignFromExisting?.address &&
				campaign.chain === campaignFromExisting?.chain
			) {
				const strat = Configure.getConflictStrategy();
				if (strat !== CampaignConflictStrategy.OVERWRITE) {
					useToken = existingToken;
					// Put new token into a store.
				}
			}
		}
	}
}

export default action;

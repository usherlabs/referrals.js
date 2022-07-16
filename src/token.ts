import lscache from "lscache";
import { Base64 } from "js-base64";
import {
	TOKEN_NAME,
	TOKEN_STORE_NAME,
	TOKEN_EXPIRY_MINUTES
} from "@/constants";
import { ConflictStrategy } from "@/types";
import Configure from "./configure";

class Token {
	/**
	 * Get Primary Token
	 */
	public static search(chain: string, address: string) {
		const cToken = Base64.encodeURI([chain, address].join(":"));
		const mainKey = [TOKEN_NAME, cToken].join(".");
		const key = Object.keys(window.localStorage).find((k) => key === mainKey);
		// return window.localStorage
	}

	/**
	 * Parse the existing Query Parameters or provided URL
	 */
	public static parse(url?: string): string | null {
		if (!url && typeof window !== "undefined") {
			url = window.location.href;
		}

		if (!url) {
			return null;
		}

		const urlInstance = new URL(url);
		const newToken = urlInstance.searchParams.get("_ushrt");

		// If this a node environment, return the first token fetched before diving into local storage
		if (typeof window === "undefined") {
			return newToken;
		}

		// Use the local storage to manage the cache
		lscache.flushExpired();

		// Load token using token name
		let token = null;
		const allTokens = this.getAll();

		if (Object.keys(allTokens).length === 0) {
			// Check store to determine if there's a token to use. //! this will run on every page load
			token = this.next();
			if (token) {
				this.set(token);
			}
		}

		// Check which to use and how to proceed.
		if (newToken && !token) {
			this.set(newToken);
			return newToken;
		}

		if (token && !newToken) {
			// Return existing token
			return token;
		}

		if (token && newToken) {
			// both exist and we have MAY have a conflict.
			const [cToken] = newToken.split(".");
			// const key = [TOKEN_NAME, cToken].join(".");
			// We can use the campaign token to determine if there is an existing token for the given campaign.
			// If there is, and the ConflictStrategy is not OVERWRITE, then put the current token into a store using lscache where the rToken (since unique) is the key
			const dec = Base64.decode(cToken).split(":");
			if (dec.length !== 2) {
				return token;
			}
			const campaign = {
				chain: dec[0],
				address: dec[1]
			};

			const [currentCToken] = token.split(".");
			// const currentKey = [TOKEN_NAME, currentCToken].join(".");
			const currentDec = Base64.decode(currentCToken).split(":");
			if (currentDec.length !== 2) {
				this.set(newToken);
				return newToken;
			}
			const currentCampaign = {
				chain: currentDec[0],
				address: currentDec[1]
			};
			if (
				campaign.address === currentCampaign?.address &&
				campaign.chain === currentCampaign?.chain
			) {
				const strat = Configure.getConflictStrategy();
				if (strat === ConflictStrategy.OVERWRITE) {
					this.set(newToken); // overwrite the existing token
					return newToken;
				}
				if (strat === ConflictStrategy.PASSTHROUGH) {
					// Put new token into a store.
					this.push(newToken);

					// Return the existing token
					return token;
				}
			} else {
				// If the tokens are not for the same campaign...
			}
		}

		return null;
	}

	private static set(token: string) {
		const [cToken, rToken] = token.split(".");
		const mainKey = [TOKEN_NAME, cToken].join(".");
		lscache.set(mainKey, rToken, TOKEN_EXPIRY_MINUTES);
	}

	/**
	 * Push token to store
	 */
	private static push(token: string) {
		const store = lscache.get(TOKEN_STORE_NAME);
		store.push([token, Date.now()]);
		lscache.set(TOKEN_STORE_NAME, store, TOKEN_EXPIRY_MINUTES);
	}

	/**
	 * Fetch the next token from the store and refresh store
	 */
	private static next(): string | null {
		let token = null;
		// Check store to determine if there's a token to use. //! this will run on every page load
		const store = lscache.get(TOKEN_STORE_NAME) as [string, number][];
		const currentTime = Date.now();
		const newStore = store.filter(
			(s) => currentTime < s[1] + TOKEN_EXPIRY_MINUTES * 60 * 1000
		);
		newStore.sort((a, b) => {
			return a[1] - b[1];
		});
		const first = newStore.shift();
		if (first) {
			[token] = first;
		}
		lscache.set(TOKEN_STORE_NAME, newStore, TOKEN_EXPIRY_MINUTES);

		return token;
	}

	/**
	 * Search for token with key that includes token name
	 */
	private static getAll() {
		if (typeof window !== "undefined") {
			const keys = Object.keys(window.localStorage).filter((k) =>
				k.includes(TOKEN_NAME)
			);
			const tokens: Record<string, string> = {};
			keys.forEach((k) => {
				const v = window.localStorage.getItem(k);
				if (v) {
					tokens[k] = v;
				}
			});
			return tokens;
		}

		return {};
	}
}

export default Token;

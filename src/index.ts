import { convert } from "./convert";
import { anchor } from "./anchor";
import Token from "./token";
import Configure from "./configure";
import { Config, CampaignReference } from "./types";

export * from "./types";

export const Usher = (config?: Config) => {
	if (config) {
		Configure.use(config);
	}

	return {
		config(c: Config) {
			Configure.use(c);
		},
		convert,
		parse(url?: string, keepQueryParam = false) {
			return Token.parse(url, keepQueryParam);
		},
		token(ref: CampaignReference) {
			return Token.next(ref);
		},
		anchor,
		flush() {
			lscache.flush();
		}
	};
};

declare global {
	interface Window {
		Usher: typeof Usher;
	}
}

if (typeof window !== "undefined") {
	window.Usher = Usher;
	window.Usher().parse(); // parse query params
}

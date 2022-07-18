import { apiUrl, stagingApiUrl } from "@/env-config";
import { Config, ConflictStrategy } from "@/types";

class Configure {
	private static _apiUrl = apiUrl;

	private static _conflictStrategy = ConflictStrategy.PASSTHROUGH;

	public static getApiUrl() {
		return this._apiUrl;
	}

	public static getConflictStrategy() {
		return this._conflictStrategy;
	}

	public static use(config: Config) {
		if (typeof config.staging === "boolean") {
			if (config.staging === true) {
				this._apiUrl = stagingApiUrl;
			} else {
				this._apiUrl = apiUrl;
			}
		}
		if (typeof config.conflictStrategy === "string") {
			const strats = Object.values(ConflictStrategy);
			if (!strats.includes(config.conflictStrategy)) {
				throw new Error(
					`Conflict Strategy must be one of type: ${strats.join(", ")}`
				);
			}
			this._conflictStrategy = config.conflictStrategy;
		}
	}
}

export default Configure;

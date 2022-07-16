import { apiUrl, stagingApiUrl } from "@/env-config";
import { Config, ConflictStrategy } from "@/types";

class Configure {
	private static _apiUrl = apiUrl;

	private static _ConflictStrategy = ConflictStrategy.PASSTHROUGH;

	public static getApiUrl() {
		return this._apiUrl;
	}

	public static getConflictStrategy() {
		return this._ConflictStrategy;
	}

	public static use(config: Config) {
		if (typeof config.staging === "boolean") {
			if (config.staging === true) {
				this._apiUrl = stagingApiUrl;
			} else {
				this._apiUrl = apiUrl;
			}
		}
		if (typeof config.ConflictStrategy === "string") {
			const strats = Object.values(ConflictStrategy);
			if (!strats.includes(config.ConflictStrategy)) {
				throw new Error(
					`Conflict Strategy must be one of type: ${strats.join(", ")}`
				);
			}
			this._ConflictStrategy = config.ConflictStrategy;
		}
	}
}

export default Configure;

import { Config } from "@/types";
import Satellite from "@/utils/satellite";

/**
 * Action to use the Staging Satellite
 * This was made as an action to allow the entire libraries behaviour to be determined at a single point
 */
const action = async (config: Config) => {
	if (typeof config.staging === "boolean") {
		if (config.staging) {
			Satellite.useStaging();
		} else {
			Satellite.useProd();
		}
	}
	console.log(`[USHER] Configuration updated.`);
};

export default action;

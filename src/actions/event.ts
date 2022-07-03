/**
 * The Event action that triggers a conversion tracking
 *
 * 1. Use the API_URL from the Env
 * 2. Fetch usher affiliate conversion id from the satellite
 * 3. Post the id and event to the api
 */

import bus from "@/utils/bus";
import Satellite from "@/utils/satellite";
import { Conversion } from "@/types";

// Eventually -- we will enable wallet authentication so that the same wallet can be registered as the same referred user.

const action = async (conversion: Conversion) => {
	if (!Satellite.isLoaded()) {
		await Satellite.load();
	}

	bus.emit("conversion", conversion);
};

export default action;

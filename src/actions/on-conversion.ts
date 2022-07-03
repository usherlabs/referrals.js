import bus from "@/utils/bus";
import { Conversion } from "@/types";

let onConversionCallback: (conversion: Conversion) => void;
let isListening = false;

const action = async (callback: typeof onConversionCallback) => {
	onConversionCallback = callback;

	if (!isListening) {
		isListening = true;
		bus.on("conversion", (busParams) => {
			const conversion = busParams as Conversion;
			if (onConversionCallback) {
				onConversionCallback(conversion);
			}
		});
	}
};

export default action;

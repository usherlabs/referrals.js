import bus from "@/utils/bus";
import { ConversionResponse } from "@/types";

let onConversionCallback: (response: ConversionResponse) => void;
let isListening = false;

const action = async (callback: typeof onConversionCallback) => {
	onConversionCallback = callback;

	if (!isListening) {
		isListening = true;
		bus.on("conversion", (busParams) => {
			const response = busParams as ConversionResponse;
			if (onConversionCallback) {
				onConversionCallback(response);
			}
		});
	}
};

export default action;

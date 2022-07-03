import bus from "@/utils/bus";

let onLoadCallback: () => void;
let isListening = false;

const action = async (callback: typeof onLoadCallback) => {
	onLoadCallback = callback;

	if (!isListening) {
		isListening = true;
		bus.on("loaded", () => {
			if (onLoadCallback) {
				onLoadCallback();
			}
		});
	}
};

export default action;

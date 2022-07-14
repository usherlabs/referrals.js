import { satelliteUrl, stagingSatelliteUrl } from "@/env-config";
import Bus from "@/utils/bus";

const elementId = "usher-satellite";

class Satellite {
	protected static isLoadedFlag = false;

	protected static url = satelliteUrl;

	public static useStaging() {
		this.url = stagingSatelliteUrl;
	}

	public static useProd() {
		this.url = satelliteUrl;
	}

	public static isLoaded() {
		return !!document.getElementById(elementId) && this.isLoadedFlag;
	}

	public static load() {
		// Render a new Satellite
		if (!this.url) {
			return Promise.reject();
		}
		if (this.isLoaded()) {
			return Promise.resolve();
		}
		const satEl = document.createElement("iframe");
		satEl.setAttribute("id", "usher-satellite");
		satEl.setAttribute("src", this.url);
		satEl.setAttribute(
			"style",
			`position:absolute !important;left:-9999px !important;top:-9999px !important;pointer-events:none !important;opacity:0 !important;visibility:hidden !important;display:none !important;height:0 !important;width:0 !important;`
		);
		document.body.append(satEl);
		return new Promise((resolve) => {
			Bus.on("loaded", () => {
				this.isLoadedFlag = true;
				resolve(null);
			});
		});
	}

	public static remove() {
		// Remove any existing Satellite
		const existingSatEl = document.getElementById("usher-satellite");
		if (
			existingSatEl &&
			existingSatEl !== null &&
			existingSatEl?.parentNode !== null
		) {
			existingSatEl.parentNode.removeChild(existingSatEl);
		}
		this.isLoadedFlag = false;
	}
}

export default Satellite;

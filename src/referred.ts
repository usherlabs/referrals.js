import cuid from "cuid";
import { randomString } from "./utils";
import { USHER_REFERRED_NAME } from "./constants";

class Referred {
	private static _id = "";

	public static id() {
		if (!this._id) {
			this.load();
		}
		if (!this._id) {
			this.new();
		}
		return this._id;
	}

	private static load() {
		if (typeof window !== "undefined") {
			const v = window.localStorage.getItem(USHER_REFERRED_NAME);
			if (v && v.length === 32) {
				this._id = v;
			}
		}
	}

	private static new() {
		this._id = [cuid(), randomString(6)].join("_");

		if (typeof window !== "undefined") {
			if (this._id && this._id.length === 32) {
				window.localStorage.setItem(USHER_REFERRED_NAME, this._id);
			}
		}
	}
}

export default Referred;

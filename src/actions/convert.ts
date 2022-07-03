import bus from "@/utils/bus";
import Satellite from "@/utils/satellite";
import { Conversion } from "@/types";

const action = async (conversion: Conversion) => {
	await Satellite.load();

	bus.emit("convert", conversion);
};

export default action;

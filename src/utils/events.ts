import EventEmitter from "eventemitter3";
import { EventParams } from "@/types";

const eventEmitter = new EventEmitter();

const Events = {
	on: (event: string, fn: (...args: any[]) => void) =>
		eventEmitter.on(event, fn),
	once: (event: string, fn: (...args: any[]) => void) =>
		eventEmitter.once(event, fn),
	off: (event: string, fn: (...args: any[]) => void) =>
		eventEmitter.off(event, fn),
	emit: (event: string, payload: EventParams) =>
		eventEmitter.emit(event, payload)
};

Object.freeze(Events);

export default Events;

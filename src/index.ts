// Entrance

import events from "@/utils/events";
import { EventParams } from "@/types";
import * as actions from "./actions";

Object.entries(actions).forEach(([actionName, actionFn]) => {
	events.on(actionName, actionFn);
});

const triggerEvent = (eventName: string, eventParams: EventParams) => {
	events.emit(eventName, eventParams);
};

if (typeof window !== "undefined") {
	window.Usher = triggerEvent;
}

export const Usher = triggerEvent;

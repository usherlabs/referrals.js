import { EventParams } from "@/types";

declare global {
	interface Window {
		Usher: (eventName: string, eventParams: EventParams) => void;
	}
}

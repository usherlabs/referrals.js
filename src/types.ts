export type Conversion = {
	id: string;
	chain: string;
	eventId: number;
	nativeId?: string;
	metadata?: Record<string, string | number | boolean>;
	commit?: number;
};

export type EventParams = Conversion;

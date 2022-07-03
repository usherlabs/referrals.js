export type Conversion = {
	id: string;
	chain: string;
	eventId: number;
	nativeId?: string;
	metadata?: Record<string, string | number | boolean>;
	commit?: number;
};

export type ConversionResponse = {
	did: string;
	response: Record<string, string | number | boolean>;
	conversion: Conversion;
};

export type ConversionCallback = (response: ConversionResponse) => void;

export type EventParams = Conversion | ConversionCallback | (() => void);

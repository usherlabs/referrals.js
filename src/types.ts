export enum ConflictStrategy {
	OVERWRITE = "overwrite",
	PASSTHROUGH = "passthrough"
}

export type Config = {
	staging?: boolean;
	ConflictStrategy?: ConflictStrategy;
};

export type CampaignReference = {
	chain: string;
	id: string;
};

export type Conversion = CampaignReference & {
	eventId: number;
	nativeId?: string;
	metadata?: Record<string, string | number | boolean>;
	commit?: number;
};

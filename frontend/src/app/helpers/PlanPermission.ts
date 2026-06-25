export type PlanPermissionPayload = {
	plan?: {
		id?: number;
		code?: string;
		name?: string;
	};
	limits?: Record<string, number | null | undefined>;
	flags?: Record<string, boolean | string | number | null | undefined>;
	allowed?: Record<string, boolean | undefined>;
	not_allowed?: Record<string, boolean | undefined>;
	usage_periods?: UsagePeriodPayload[] | Record<string, UsagePeriodPayload | undefined>;
};

export type UsagePeriodPayload = {
	capability_key?: string | null;
	used?: number | null;
	limit?: number | null;
	period_start?: string | null;
	period_end?: string | null;
	reset_strategy?: string | null;
};

const aliases = {
	upload_business_logo: 'logo_upload',
	business_logo: 'logo_upload',
	logo_upload: 'logo_upload',

	custom_brand_colors: 'custom_branding',
	custom_branding: 'custom_branding',

	custom_invoice_numbering: 'custom_prefix',
	invoice_numbering: 'custom_prefix',

	templates: 'templates_tier',
	invoice_templates: 'templates_tier',
	advanced_templates: 'templates_tier',

	automated_reminders: 'automated_reminders',
	manual_reminders: 'automated_reminders',

	online_payments: 'online_payments',
	payment_links: 'online_payments',

	multi_currency: 'multi_currency',
	ai_invoice_assistant: 'ai_invoice_assistant',

	analytics: 'analytics_tier',
	support: 'support_level',

	email_branding: 'email_branding',
	pdf_watermark: 'pdf_watermark',
	email_watermark: 'email_watermark',

	create_business_profile: 'max_business_profiles',
	business_profiles: 'max_business_profiles',

	create_client: 'max_clients',
	clients: 'max_clients',

	create_invoice: 'max_invoices_per_month',
	invoices: 'max_invoices_per_month',
	invoices_per_month: 'max_invoices_per_month',
} as const;

const inverseAliases = {
	remove_pdf_watermark: 'pdf_watermark',
	no_pdf_watermark: 'pdf_watermark',
	pdf_without_watermark: 'pdf_watermark',

	remove_email_watermark: 'email_watermark',
	no_email_watermark: 'email_watermark',
	email_without_watermark: 'email_watermark',
} as const;

const currentUsageKeys: Record<string, string> = {
	max_business_profiles: 'current:businessProfiles',
	max_clients: 'current:clients',
	max_invoices_per_month: 'current:invoices',
};

type AliasKey = keyof typeof aliases;
type InverseAliasKey = keyof typeof inverseAliases;

export class PlanPermission {
	constructor(private readonly payload: PlanPermissionPayload | null | undefined) {}

	can(ability: string, currentUsage?: number): boolean {
		const rawKey = this.normalizeKey(ability);
		const key = this.normalizeNormalizedKey(rawKey);
		const result = this.canNormalizedKey(key, currentUsage);

		return this.isInverseNormalizedKey(rawKey) ? !result : result;
	}

	has(ability: string): boolean {
		return this.can(ability);
	}

	get<T = unknown>(key: string, defaultValue?: T): T | null {
		const normalizedKey = this.normalize(key);

		if (this.hasOwn(this.payload?.limits, normalizedKey)) {
			return this.payload?.limits?.[normalizedKey] as T | null;
		}

		if (this.hasOwn(this.payload?.flags, normalizedKey)) {
			return this.payload?.flags?.[normalizedKey] as T | null;
		}

		return defaultValue ?? null;
	}

	canWithinLimit(limitKey: string, currentUsage?: number): boolean {
		const normalizedKey = this.normalize(limitKey);

		if (! this.hasOwn(this.payload?.limits, normalizedKey)) {
			return false;
		}

		const limit = this.payload?.limits?.[normalizedKey];

		if (limit === null) {
			return true;
		}

		if (typeof limit !== 'number') {
			return false;
		}

		const usage = currentUsage ?? this.currentUsageFor(normalizedKey);

		if (typeof usage === 'number') {
			return usage < limit;
		}

		return limit > 0;
	}

	notAllowed(ability: string): boolean {
		return ! this.can(ability);
	}

	private canNormalizedKey(key: string, currentUsage?: number): boolean {
		if (this.hasOwn(this.payload?.allowed, key)) {
			return Boolean(this.payload?.allowed?.[key]);
		}

		if (this.hasOwn(this.payload?.limits, key)) {
			return this.canWithinLimit(key, currentUsage);
		}

		if (this.hasOwn(this.payload?.flags, key)) {
			return this.allowsFlagValue(this.payload?.flags?.[key]);
		}

		return false;
	}

	private currentUsageFor(limitKey: string): number | undefined {
		const periodUsage = this.usagePeriodFor(limitKey)?.used;

		if (typeof periodUsage === 'number') {
			return periodUsage;
		}

		const currentKey = currentUsageKeys[limitKey];

		if (currentKey) {
			const currentUsage = this.payload?.limits?.[currentKey];

			if (typeof currentUsage === 'number') {
				return currentUsage;
			}
		}

		return undefined;
	}

	private usagePeriodFor(limitKey: string): UsagePeriodPayload | undefined {
		const periods = this.payload?.usage_periods;

		if (! periods) {
			return undefined;
		}

		if (Array.isArray(periods)) {
			return periods.find((period) => period?.capability_key === limitKey);
		}

		return periods[limitKey];
	}

	private allowsFlagValue(value: boolean | string | number | null | undefined): boolean {
		if (typeof value === 'boolean') {
			return value;
		}

		if (typeof value === 'string') {
			return value.trim() !== '' && value.toLowerCase() !== 'none';
		}

		if (typeof value === 'number') {
			return value > 0;
		}

		return false;
	}

	private normalize(key: string): string {
		return this.normalizeNormalizedKey(this.normalizeKey(key));
	}

	private normalizeKey(key: string): string {
		return key.toLowerCase().replace(/[-\s]+/g, '_');
	}

	private normalizeNormalizedKey(key: string): string {
		if (this.isInverseNormalizedKey(key)) {
			return inverseAliases[key];
		}

		if (this.isAliasKey(key)) {
			return aliases[key];
		}

		return key;
	}

	private isAliasKey(key: string): key is AliasKey {
		return this.hasOwn(aliases, key);
	}

	private isInverseNormalizedKey(key: string): key is InverseAliasKey {
		return this.hasOwn(inverseAliases, key);
	}

	private hasOwn<T extends object>(object: T | null | undefined, key: PropertyKey): key is keyof T {
		return Object.prototype.hasOwnProperty.call(object, key);
	}
}

export function createPlanPermission(payload?: PlanPermissionPayload | null) {
	return new PlanPermission(payload);
}

// Example:
// const planPermission = createPlanPermission(userData?.plan_capabilities);
// planPermission.can('upload_business_logo');
// planPermission.canWithinLimit('max_clients', currentClientCount);

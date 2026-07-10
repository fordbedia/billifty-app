"use client";

import Model from "@/foundation/Model";

export default class AdvancedFilter extends Model {
	static resource = "advanced-filter";

	static async getInvoiceAdvancedFilterMetadata() {
		return await this.axios().get('/invoice-module')
	}

	// ----------------------------------------------------------------------------
	// Used to fire value_source
	// ----------------------------------------------------------------------------
	static async getAdvancedFilterOptions(module, valueSource, search = "", page = 1, perPage = 25) {
		return await this.axios().get("/options", {
			params: {
				module,
				value_source: valueSource,
				search,
				page,
				per_page: perPage,
			},
		});
	}
	static async onSearch(module, search) {
		return await this.axios().get(`/on-search?${search}`, {
			params: {
				module,
			},
		});
	}
}

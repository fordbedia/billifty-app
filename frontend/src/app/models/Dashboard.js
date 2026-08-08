"use client";

import Model from "@/foundation/Model";

export default class Dashboard extends Model {
	static resource = 'dashboard';

	static async dashboard(params = {}) {
		const res = await this.axios().get("/", {
			params
		});
		return res.data;
	}
}

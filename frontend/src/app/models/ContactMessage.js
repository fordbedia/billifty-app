"use client";

import Model from "@/foundation/Model";

export default class ContactMessage extends Model {
	static resource = 'contact-message';

	static async create(payload) {
		return await this.axios().post('', payload);
	}
}

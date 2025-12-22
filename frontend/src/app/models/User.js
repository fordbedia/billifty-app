"use client";

import Model from "@/foundation/Model";

export default class User extends Model {
    static resource = 'user';

		static async logout() {
			return await this.axios().post('logout')
		}

		static async register(data, next = null) {
			const uri = next ? `/?next=${next}` : '/';
			return await this.axios().post(uri, data)
		}

		static async login(data, next) {
			const uri = next ? `/login?next=${next}` : '/login';
			return await this.axios().post(uri, data)
		}

		static async me() {
			return await this.axios().get('/me')
		}
}
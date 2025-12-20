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

		static async login(data) {
			return await this.axios().post('/login', data)
		}

		static async me() {
			return await this.axios().get('/me')
		}
}
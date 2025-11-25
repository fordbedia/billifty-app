"use client";

import Model from "@/foundation/Model";

export default class User extends Model {
    static resource = 'user';

		static async logout() {
			return await this.axios().post('logout')
		}

		static async register(data) {
			return await this.axios().post('/', data)
		}

		static async login(data) {
			return await this.axios().post('/login', data)
		}
}
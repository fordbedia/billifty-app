"use client";

import Model from "@/foundation/Model";

export default class User extends Model {
    static resource = 'user';

			static async logout() {
				return await this.axios().post('logout')
			}

			/**
			 * @param {Record<string, any>} data
			 * @param {string | null} [next=null]
			 */
			static async register(data, next = null) {
				const uri = next ? `/?next=${next}` : '/';
				return await this.axios().post(uri, data)
			}

			/**
			 * @param {Record<string, any>} data
			 * @param {string | null} [next=null]
			 */
			static async login(data, next) {
				const uri = next ? `/login?next=${next}` : '/login';
				return await this.axios().post(uri, data)
			}

		static async me() {
			return await this.axios().get('/me')
		}

		static async edit(payload) {
			return await this.axios().post(`/${payload.get('id')}`, payload)
		}
}

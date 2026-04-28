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
				const uri = next ? `/?next=${encodeURIComponent(next)}` : '/';
				return await this.axios().post(uri, data)
			}

			/**
			 * @param {Record<string, any>} data
			 * @param {string | null} [next=null]
			 */
			static async login(data, next) {
				const uri = next ? `/login?next=${encodeURIComponent(next)}` : '/login';
				return await this.axios().post(uri, data)
			}

		static async me() {
			return await this.axios().get('/me')
		}

		static async edit(payload) {
			return await this.axios().post(`/${payload.get('id')}`, payload)
		}

		static async updatePassword(userId, payload) {
				return await this.axios().post(`change-password`, payload)
		}

		static async resendVerificationEmail() {
				return await this.axios().post('/email/verification-notification')
		}
}

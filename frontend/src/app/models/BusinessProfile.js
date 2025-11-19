import Model from "@/foundation/Model";

export default class BusinessProfile extends Model {
    static resource = 'business-profile';

	static async all(params, queryParams){
		return await this.axios().get('/')
	}

	static async paginate(payload) {
		return await this.axios().get(`/get-all?page=${payload.page}`, {params: payload})
	}

	static async create(data) {
		return await this.axios().post('/', data)
	}

	static async show(id) {
		return await this.axios().get(`/${id}`)
	}

	static async update(id, data) {
		if (data instanceof FormData) {
			data.append('_method', 'PUT');
			return await this.axios().post(`/${id}`, data)
		}
		return await this.axios().put(`/${id}`, data)
	}

	static async archive(id) {
		return await this.axios().post(`/archive/${id}`)
	}
}
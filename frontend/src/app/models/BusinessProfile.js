import Model from "@/foundation/Model";

export default class BusinessProfile extends Model {
    static resource = 'business-profile';

	static async all(params, queryParams){
		return await this.axios().get('/')
	}

	static async paginate() {
		return await this.axios().get('/get-all')
	}

	static async create(data) {
		return await this.axios().post('/', data)
	}
}
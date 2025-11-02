import Model from "@/foundation/Model";

export default class BusinessProfile extends Model {
    static resource = 'business-profile';

	static async all(params, queryParams){
		let res = await this.axios().get('/')

        return res.data
	}
}
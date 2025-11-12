import Model from "@/foundation/Model";

export default class Template extends Model{
    static resource = 'template';

    static async getAllByCategory(catid) {
        return await this.axios().get(`/category/${catid}`)
    }

	static async get( id) {
		return await this.axios().get(`/${id}`)
	}
}
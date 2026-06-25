import Model from "@/foundation/Model";

export default class Plans extends Model {
	static resource = 'plan';

	static async allPlans() {
		return await this.axios().get('/')
	}

	static async getPlan(plan) {
		return await this.axios().get(`/look-up/${plan}`)
	}
}
import Model from "@/foundation/Model";

export default class Currency extends Model{
    static resource = 'currency';

    static async getAll() {
        return await this.axios().get('/')
    }
}
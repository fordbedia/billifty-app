import Model from "@/foundation/Model";

export default class TemplateCategory extends Model{
    static resource = 'template-category';

    static async getAll() {
        return await this.axios().get('/')
    }
}
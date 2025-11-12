import Model from "@/foundation/Model";

export default class ColorScheme extends Model{
    static resource = 'color-scheme';

    static async getAll() {
        return await this.axios().get('/')
    }
}
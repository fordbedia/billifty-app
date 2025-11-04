"use client";

import Model from "@/foundation/Model";

export default class Clients extends Model {
    static resource = 'client';

    static async all() {
        return await this.axios().get('/')
    }
}
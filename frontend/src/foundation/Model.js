"use client";

import axios from 'axios';

export default class Model {
  static baseURL = process.env.NEXT_PUBLIC_SECURE_URL + '/api/v1'
  static resource;
  data = {};

  constructor(data) {
		if(typeof data === 'object') {
			this.data = data
		} else if (Number.isInteger(data)) {
			this.data = this.axios.get().then(r => r.data)
		}
	}

  static axios() {
  	const resource = this.resource ?? this.getName()
		// const token = Auth.getToken()
    return axios.create({
      baseURL: `${this.baseURL}/${resource}`,
      headers: {
        Accept: 'application/json',
        // Authorization: 'Bearer ' + token,
      },
    });
  }

  static guest() {
      return axios.create({ baseURL: `${this.baseURL}/${resource}`, })
  }

  getName () {
  	return this.constructor.name
  }

  static async all(params = {}) {
    const res = await this.axios().get('', { params });
    return res.data;
  }

  static async find(id) {
		return await this.axios().get(`/${id}`);
  }

  static async get(endpoint = '', params = {})
	{
		const res = await this.axios().get(endpoint, { params })
		return res.data
	}

	static async send(endpoint = '', payload = {}) {
  	const res = await this.axios().post(endpoint, payload)
		return res.data
	}

  static async create(data = null) {
  	const payload = data ?? this.data
    const res = await this.axios().post('', payload);
    return res.data;
  }

  static async update(id, data) {
		return await this.axios().put(`/${id}`, data);
  }

  static async delete(id) {
    const res = await this.axios().delete(`/${id}`);
    return res;
  }
}

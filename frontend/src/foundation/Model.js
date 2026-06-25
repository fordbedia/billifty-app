"use client";

import axios from 'axios';
import {auth} from "@/app/helpers/auth";

function resolveApiBaseURL() {
	const configuredApiURL = process.env.NEXT_PUBLIC_API_URL?.trim();
	const secureURL = process.env.NEXT_PUBLIC_SECURE_URL?.trim();
	const apiRoot = configuredApiURL || (secureURL ? `${secureURL}/api` : '/api');
	const normalizedApiRoot = apiRoot.replace(/\/+$/, '');

	return normalizedApiRoot.endsWith('/v1') ? normalizedApiRoot : `${normalizedApiRoot}/v1`;
}

export default class Model {
  static baseURL = resolveApiBaseURL()
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
		const token = auth()?.token?.replace(/"/g, '').trim() ?? null;
		const headers = {
			Accept: 'application/json',
		};

		if (token) {
			headers['Authorization'] = 'Bearer ' + token;
		}

    return axios.create({
      baseURL: `${this.baseURL}/${resource}`,
     	headers
    });
  }

  static guest() {
		const resource = this.resource ?? this.getName()

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

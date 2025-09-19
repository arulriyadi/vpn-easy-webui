import router from "@/router/router.js";
import {DashboardConfigurationStore} from "@/stores/DashboardConfigurationStore.js";

const getHeaders = () => {
	let headers = {
		"content-type": "application/json"
	}
	const store = DashboardConfigurationStore();
	const apiKey = store.getActiveCrossServer();
	if (apiKey){
		headers['wg-dashboard-apikey'] = apiKey.apiKey
	}
	return headers
}

const getUrl = (url) => {
	const store = DashboardConfigurationStore();
	const apiKey = store.getActiveCrossServer();
	if (apiKey){
		return `${apiKey.host}${url}`
	}
	return import.meta.env.MODE === 'development' ? url 
		: `${window.location.protocol}//${(window.location.host + window.location.pathname + url).replace(/\/\//g, '/')}`
}

export const fetchGet = async (url, params=undefined, callback=undefined) => {
	const urlSearchParams = new URLSearchParams(params);
	try {
		const response = await fetch(`${getUrl(url)}?${urlSearchParams.toString()}`, {
			headers: getHeaders()
		});
		
		const store = DashboardConfigurationStore();
		if (!response.ok){
			if (response.status !== 200){
				if (response.status === 401){
					store.newMessage("WGDashboard", "Sign in session ended, please sign in again", "warning")
				}
				throw new Error(response.statusText)
			}
		}
		
		const data = await response.json();
		if (callback) {
			callback(data);
		}
		return data;
	} catch (error) {
		// store.newMessage("WGDashboard", `Error: ${error}`, "danger")
		router.push({path: '/signin'})
		throw error;
	}
}

export const fetchPost = async (url, body, callback) => {
	try {
		const response = await fetch(`${getUrl(url)}`, {
			headers: getHeaders(),
			method: "POST",
			body: JSON.stringify(body)
		});
		
		const store = DashboardConfigurationStore();
		if (!response.ok){
			if (response.status !== 200){
				if (response.status === 401){
					store.newMessage("WGDashboard", "Sign in session ended, please sign in again", "warning")
				}
				throw new Error(response.statusText)
			}
		}
		
		const data = await response.json();
		if (callback) {
			callback(data);
		}
		return data;
	} catch (error) {
		// store.newMessage("WGDashboard", `Error: ${error}`, "danger")
		router.push({path: '/signin'})
		throw error;
	}
}

export const fetchPut = async (url, body, callback) => {
	try {
		const response = await fetch(`${getUrl(url)}`, {
			headers: getHeaders(),
			method: "PUT",
			body: JSON.stringify(body)
		});
		
		const store = DashboardConfigurationStore();
		if (!response.ok){
			if (response.status !== 200){
				if (response.status === 401){
					store.newMessage("WGDashboard", "Sign in session ended, please sign in again", "warning")
				}
				throw new Error(response.statusText)
			}
		}
		
		const data = await response.json();
		if (callback) {
			callback(data);
		}
		return data;
	} catch (error) {
		// store.newMessage("WGDashboard", `Error: ${error}`, "danger")
		router.push({path: '/signin'})
		throw error;
	}
}

export const fetchDelete = async (url, callback) => {
	try {
		const response = await fetch(`${getUrl(url)}`, {
			headers: getHeaders(),
			method: "DELETE"
		});
		
		const store = DashboardConfigurationStore();
		if (!response.ok){
			if (response.status !== 200){
				if (response.status === 401){
					store.newMessage("WGDashboard", "Sign in session ended, please sign in again", "warning")
				}
				throw new Error(response.statusText)
			}
		}
		
		const data = await response.json();
		if (callback) {
			callback(data);
		}
		return data;
	} catch (error) {
		// store.newMessage("WGDashboard", `Error: ${error}`, "danger")
		router.push({path: '/signin'})
		throw error;
	}
}
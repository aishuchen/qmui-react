import _axios from "axios";
import { SearchBaseUrl } from "./consts";

function onError(err) {
	alert(`请求失败:${err}`)
}


const axios = _axios.create({
	baseURL: SearchBaseUrl
})

axios.interceptors.request.use(
	(config) => {return config}, 
	(err) => {onError(err)}
)

axios.interceptors.response.use(
	(resp) => {return resp}, 
	(err) => {onError(err)}
)

async function get(url, params) {
	const resp = await axios.get(url, {params: params})
	return resp
}

async function post(url, data) {
	const resp = await axios.post(url, data)	
	return resp
}
export {get, post}

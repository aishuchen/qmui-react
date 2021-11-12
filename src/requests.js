import _axios from "axios";
import { SearchBaseUrl } from "./consts";


const axios = _axios.create({
	baseURL: SearchBaseUrl
})


async function get(url, params) {
	const resp = await axios.get(url, {params: params})
	return resp
}

export {get}

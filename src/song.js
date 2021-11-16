import {get} from "./requests"
const songsAPI = "/songs"

async function search(kw) {
	let resp = await get(songsAPI, { "kw": kw })
	return resp
}

async function retrieveUrl(songmid) {
	let url = `${songsAPI}/${songmid}/playUrl`
	let resp = await get(url)
	return resp
}

function joinSingerName(singers) {
	let names = []
	singers.forEach(element => {
		names.push(element.name)
	});
	return names.join("/")
}

export {search, retrieveUrl, joinSingerName}
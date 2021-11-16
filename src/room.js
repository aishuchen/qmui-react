import { get, post } from "./requests"

const membersAPI = "/members"
const roomsAPI = "/rooms"

async function createMember() {
	let resp = await post(membersAPI, null)
	if (resp === undefined || resp.status !== 201) {
		return null
	}
	return resp.data

}

async function getRoom(key) {
	let api = `${roomsAPI}/${key}`
	let resp = await get(api)
	return resp
}

async function getRooms() {
	let resp = await get(roomsAPI)
	return resp
}

async function createRoom(name) {
	let resp = await post(roomsAPI, {name: name})
	return resp
}

async function memberJoinRoom(roomKey) {
	let api = `${membersAPI}/joinZoom`
	let resp = post(api, {roomKey: roomKey})
	return resp
}

async function getRoomMembers(roomKey) {
	let api = `${roomsAPI}/${roomKey}/members`
	let resp = get(api)
	return resp
}

async function getRoomSongs(roomKey) {
	let api = `${roomsAPI}/${roomKey}/songs`
	let resp = get(api)
	return resp
}

export {createMember, getRoom, getRooms, createRoom, memberJoinRoom, getRoomMembers, getRoomSongs}
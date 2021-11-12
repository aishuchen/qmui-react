import { get } from "./requests";
import React from "react";
import { Table, InputGroup, Input, Button } from "reactstrap";
/*
Body:
	SearchContainer:
		SearchBox
		SearchResult
	ZoomContainer:
		Zoom
	PlayerContainer:
		Player:
*/

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

function play(songUrl) {
	let player = document.getElementById("player")
	player.src = songUrl
	player.load()
	player.play()

}


class SearchBox extends React.Component {
	inputTextRef = React.createRef()
	btnRef = React.createRef()

	async doSearch() {
		let kw = this.inputTextRef.current.value
		let resp = await search(kw)
		if (resp.status !== 200) {
			alert("error")
			return
		}
		this.props.father.onSearchRetChange(kw, resp.data.data.song.list)
	}

	render() {
		return (
			<div>
				<InputGroup>
					<Input innerRef={this.inputTextRef} defaultValue={this.props.searchKw} />
					<Button onClick={() => this.doSearch()}>
						search
					</Button>
				</InputGroup>
			</div>
		)
	}
}

class SearchResult extends React.Component {

	newRowsTmpl() {
		let searchRet = this.props.searchRet
		let rows = []
		for (let i = 0; i < searchRet.length; i++) {
			rows[i] = this.renderRow(i, searchRet[i])
		}
		return rows
	}

	notifyToPlay(songmid) {
		this.props.father.notifyToPlay(songmid)
	}

	renderRow(index, song) {
		return (
			<tr key={song.mid}>
				<th scope="row"> {index} </th>
				<td> <Button size="sm" onClick={() => { this.notifyToPlay(song.mid) }}>播放</Button>{song.name} </td>
				<td> {joinSingerName(song.singer)} </td>
				<td> @mdo </td>
			</tr>
		)
	}

	render() {
		return (
			<Table
				borderless
			>
				<thead>
					<tr>
						<th> # </th>
						<th> 歌名 </th>
						<th> 歌手 </th>
						<th> 专辑 </th>
					</tr>
				</thead>
				<tbody>
					{this.newRowsTmpl()}
				</tbody>
			</Table>
		)
	}
}

class SearchContainer extends React.Component {
	constructor(props) {
		super(props)
		let searchRet = sessionStorage.getItem("searchRet")
		let searchKw = sessionStorage.getItem("searchKw")
		if (searchRet !== null) {
			searchRet = JSON.parse(searchRet)
		} else {
			searchRet = []
		}
		this.state = {
			searchRet: searchRet,
			searchKw: searchKw
		}
	}

	onSearchRetChange(kw, ret) {
		this.setState({
			searchRet: ret,
			searchKw: kw
		})
		sessionStorage.setItem("searchRet", JSON.stringify(ret))
		sessionStorage.setItem("searchKw", kw)
	}

	notifyToPlay(songmid) {
		this.props.father.notifyToPlay(songmid)
	}

	render() {
		return (
			<div>
				<SearchBox father={this} searchKw={this.state.searchKw} />
				<SearchResult father={this} searchRet={this.state.searchRet} />
			</div>
		)
	}
}

class Zoom extends React.Component {
	render() {
		return (
			<div>
				zooms
			</div>
		)
	}
}

class ZoomContainer extends React.Component {
	render() {
		return <Zoom />
	}
}

class Player extends React.Component {
	render() {
		return <div>
			player:
			<audio controls="controls" id="player">
				Your browser does not support this audio format.
			</audio>
		</div>
	}
}

class PlayerContainer extends React.Component {
	palyerRef = React.createRef()

	constructor(props) {
		super(props)
		this.state = { playingSongUrl: "" }
	}

	async prePlay(songmid) {
		let resp = await retrieveUrl(songmid)
		if (resp.status !== 200) {
			alert("error")
			return
		}
		let url = resp.data.playUrl
		console.log(url)
		play(url)
	}

	render() {
		return <Player father={this} ref={this.palyerRef}></Player>
	}
}

export { SearchContainer, ZoomContainer, PlayerContainer }

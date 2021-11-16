import React from "react";
import { Table, InputGroup, Input, Button, ListGroup, ListGroupItem } from "reactstrap";
import { search, retrieveUrl, joinSingerName } from "./song";
import { getRoom, getRooms, createRoom, memberJoinRoom, getRoomMembers, getRoomSongs } from "./room"
import { ThemeConsumer } from "evergreen-ui";
/*
Body:
	SearchContainer:
		SearchBox
		SearchResult
	RoomContainer:
		Room
	PlayerContainer:
		Player:
*/


async function prePlay(songmid) {
	let resp = await retrieveUrl(songmid)
	if (resp.status !== 200) {
		alert("error")
		return
	}
	let url = resp.data.playUrl
	return url
}

async function play(songmid) {
	let url = await prePlay(songmid)
	let player = document.getElementById("player")
	player.src = url 
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

	renderRow(index, song) {
		return (
			<tr key={song.mid}>
				<th scope="row"> {index} </th>
				<td> <Button size="sm" onClick={() => { play(song.mid) }}>播放</Button>{song.name} </td>
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

	render() {
		return (
			<div>
				<SearchBox father={this} searchKw={this.state.searchKw} />
				<SearchResult father={this} searchRet={this.state.searchRet} />
			</div>
		)
	}
}

class RoomHeader extends React.Component {
	searchRef = React.createRef()
	newRef = React.createRef()

	async newRoom() {
		let val = this.newRef.current.value
		let resp = await createRoom(val)
		if (resp.status !== 201) {
			alert("error when createRoom")
			return
		}
		this.props.father.goToRoom(resp.data)
	}

	render() {
		return (
			<div>
				<InputGroup>
					<Input innerRef={this.newRef} />
					<Button color="primary" onClick={() => this.newRoom()}>
						新建
					</Button>
				</InputGroup>
				<InputGroup>
					<Input innerRef={this.searchRef} />
					<Button onClick={null}>
						search
					</Button>
				</InputGroup>
			</div>
		)
	}
}

// 房间内已点的歌单
class RoomSongList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {data: []}
	}

	async init() {
		let roomKey = this.props.data.key
		let resp = await getRoomSongs(roomKey)
		if(resp === undefined || resp.status !== 200) {
			alert("error when getRoomSongs")
			this.state = {data: []}
			return
		}
		this.stata = {data: resp.data.data}
	}

	// componentDidMount() {
	// 	this.init() // 初始化获取房间内歌单
	// }

	newItems() {
		console.log(this.props.data)
		let items = []
		let data = this.state.data
		data.forEach(element => {
			items.push(
				<ListGroupItem key={element.mid}>
					{element.name} ({element.singer.name})
				</ListGroupItem>
			)
		});
		return items
	}

	render() {
		console.log(this.props.data)
		return (
			<div>
				<div>已点歌曲</div>
				{[...this.newItems()]}
			</div>
		)
	}
}

// 房间的成员集合
class MemberSet extends React.Component {
	constructor(props) {
		super(props)
		this.init() // 初始化获取成员集合
	}

	async init() {
		let roomKey = this.props.data.key
		let resp = await getRoomMembers(roomKey)
		if(resp === undefined || resp.status !== 200) {
			alert("error when getRoomMembers")
			this.state = {data: []}
			return
		}
		this.stata = {data: resp.data.data}
	}

	componentDidMount() {
	}

	newItems() {
		let items = []
		let data = this.state.data
		data.forEach(element => {
			items.push(
				<ListGroupItem key={element.ip}>
					{element.nick} ({element.ip})
				</ListGroupItem>
			)
		});
		return items
	}

	render() {
		return (
			<div>
				<div>房间成员</div>
				{[...this.newItems()]}
			</div>
		)
	}
}

class RoomDetail extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<div>{this.props.data.key} -- {this.props.data.name}</div>
				<RoomSongList data={this.props.data} />
				{/* <MemberSet data={{}} /> */}
			</div>
		)
	}
}

class RoomList extends React.Component {
	colors = ["success", "info", "warning", "danger"]

	constructor(props) {
		super(props)
		this.state = { li: [] }
	}

	componentDidMount() {
		this.onListChanged() //初始化一次
	}

	componentWillUnmount() {
	}

	async onListChanged() {
		let resp = await getRooms()
		if (resp === undefined || resp.status !== 200) {
			alert("error when getRooms")
			return
		}
		let li = resp.data.data
		this.setState({ li: li })
	}

	getRandomColor() {
		return this.colors[Math.random() * this.colors.length]
	}

	async joinRoom(roomKey) {
		let resp = await getRoom(roomKey)
		if (resp === undefined || resp.status !== 200) {
			alert("error when getRoom")
			return
		}
		let roomData = resp.data
		resp = await memberJoinRoom(roomKey)
		if (resp === undefined || resp.status !== 200) {
			alert("error when memberJoinRoom")
			return
		}
		this.props.father.goToRoom(roomData)
	}

	newItems() {
		let items = []
		this.state.li.forEach(element => {
			items.push(
				<ListGroupItem color={this.getRandomColor()} key={element.key} tag="a" href="#" onClick={() => this.joinRoom(element.key)}>
					{element.name}
				</ListGroupItem>
			)
		});
		return items
	}

	render() {
		return (
			<ListGroup>
				{[...this.newItems()]}
			</ListGroup>
		)
	}
}

class Room extends React.Component {
	constructor(props) {
		super(props)
		this.state = { shouldShow: "list", roomData: {} }
	}

	setShowState(state) {
		this.setState({ shouldShow: state })
	}

	newContent() {
		if (this.state.shouldShow === "list") {
			return <RoomList father={this}></RoomList>
		}
		return <RoomDetail data={this.state.roomData}></RoomDetail>
	}

	goToRoom(roomData) {
		this.setShowState("detail")
		this.setState({ roomData: roomData })
	}

	render() {
		console.log("room")
		return (
			<div>
				<RoomHeader father={this} />
				<div>
					<Button color="light" onClick={() => this.setShowState("list")}>
						列表
					</Button>
					<Button color="light" onClick={() => this.setShowState("detail")}>
						当前
					</Button>
				</div>
				{this.newContent()}
			</div>
		)
	}
}

class RoomContainer extends React.Component {
	render() {
		return <Room />
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

	render() {
		return <Player father={this} ref={this.palyerRef}></Player>
	}
}

export { SearchContainer, RoomContainer, PlayerContainer }

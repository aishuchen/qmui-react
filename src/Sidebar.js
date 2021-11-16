import react from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { SearchItemKey, RoomItemKey } from "./consts";

class SideBarGroup extends react.Component {
	constructor(props) {
		super(props)
		this.state = {
			seletedItem: RoomItemKey
		}
		this._itemsProperty = [{
			group: this,
			content: "房间",
			key: RoomItemKey
		}, {
			group: this,
			content: "搜索",
			key: SearchItemKey
		}
		]
	}

	newItems() {
		let items = []
		this._itemsProperty.forEach(item => {
			items.push(
				<ListGroupItem
					action
					active={this.activate(this.state.seletedItem, item.key)}
					tag="button"
					key={item.key}
					onClick={() => this.onItemClick(item.key)}
				>
					{item.content}
				</ListGroupItem>
			)
		})
		return items
	}

	activate (seleted, cur) {
		return seleted === cur
	}

	onItemClick(selected) {
		this.setState({seletedItem: selected})
		this.props.father.onItemChange(selected)
	}

	render() {
		return (
			<ListGroup flush>
				{[...this.newItems().values()]}
			</ListGroup>
		)
	}
}

class SideBar extends react.Component {
	onItemChange(selected) {
		// this.props.father.setState({selectedItem: selected})
		this.props.father.onSideBarItemChange(selected)
	}

	render() {
		return (
			<div>
				<h4> Listen-With-Me </h4>
				<SideBarGroup father={this}/>
			</div>
		)
	}
}


export default SideBar;
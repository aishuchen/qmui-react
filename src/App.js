import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './Sidebar';
import { Container, Row, Col } from 'reactstrap';
import { PlayerContainer, SearchContainer, RoomContainer } from './Body'
import React from 'react';
import { SearchItemKey, RoomItemKey } from './consts';
import { Alert } from "./Alert"

class App extends React.Component {
  playerRef = React.createRef()

  constructor(props) {
    super(props)
    this.state = { selectedItem: "", playingSongmid: ""}
    
  }

  onSideBarItemChange(selected) {
    this.setState({ selectedItem: selected })
  }

  renderBody() {
    switch (this.state.selectedItem) {
      case SearchItemKey: {
        return <SearchContainer father={this}/>
      }
      case RoomItemKey: {
        return <RoomContainer />
      }
      default: {
        return <RoomContainer />
      }
    }
  }


  render() {
    return (
      <Container>
        <Row>
          <Col
            className="bg-light border"
            xs="2"
          >
            <SideBar father={this} />
          </Col>
          <Col
            className="bg-light border"
            xs="10"
          >
            {this.renderBody()}
          </Col>
        </Row>
        <Row className="bg-light border">
          <PlayerContainer ref={this.playerRef}/>
        </Row>
      </Container>
    );
  }
}

export default App;

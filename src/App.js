import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './Sidebar';
import { Container, Row, Col } from 'reactstrap';
import { PlayerContainer, SearchContainer, ZoomContainer } from './Body'
import React from 'react';
import { SearchItemKey, ZoomItemKey } from './consts';

class App extends React.Component {
  playerRef = React.createRef()

  constructor(props) {
    super(props)
    this.state = { selectedItem: "", playingSongmid: ""}
    
  }

  onSideBarItemChange(selected) {
    this.setState({ selectedItem: selected })
  }

  notifyToPlay(songmid) {
    this.playerRef.current.prePlay(songmid)
  }

  renderBody() {
    switch (this.state.selectedItem) {
      case SearchItemKey: {
        return <SearchContainer father={this}/>
      }
      case ZoomItemKey: {
        return <ZoomContainer />
      }
      default: {
        return <ZoomContainer />
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

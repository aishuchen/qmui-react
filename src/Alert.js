import React from "react";
import { Alert as _Alert } from "reactstrap";

class Alert extends React.Component {

	render() {
		return (
			<_Alert>{this.props.msg}</_Alert>
		)
	}
}

export default Alert
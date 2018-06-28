import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

class Progress extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isShowing: false,
		};
	}

	componentDidMount() {
		this.timeout = setTimeout(() => this.setState({ isShowing: true }), 200);
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	render() {
		if (this.state.isShowing) {
			return (
				<CircularProgress {...this.props}/>
			);
		}else {
			return null;
		}
	}

}

export default Progress;
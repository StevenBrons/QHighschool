import React, { Component } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

class LoadIcon extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isShowing: false,
		};
	}

	componentDidMount() {
		this.timeout = setTimeout(() => this.setState({ isShowing: true }), 300);
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	render() {
		if (this.state.isShowing) {
			return (
				<PulseLoader
					color={'#ff7a03'}
				/>
			);
		}else {
			return null;
		}
	}

}

export default LoadIcon;
import React, { Component } from 'react';
import { connect } from 'react-redux';
import grid from '../lib/Grid';

class Page extends Component {

	render() {
		let style = {};
		if (this.props.showMenu) {
			style = grid({
				x: 3,
				w: 12,
				y: 2,
				h: 13,
			});
		} else {
			style = grid({
				x: 1,
				w: 15,
				y: 2,
				h: 13,
			});
		}
		return (
			<div className="Page" style={style}>
				{this.props.children}
			</div>
		);
	}

}


function mapStateToProps(state) {
	return {
		showMenu: state.showMenu,
	};
}

export default connect(mapStateToProps)(Page);

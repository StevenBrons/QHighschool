import React, { Component } from 'react';
import { connect } from 'react-redux';

class Page extends Component {

	render() {
		let className = this.props.className;
		if (this.props.showMenu) {
			className += " menuShown"
		} else {
			className += " menuHidden"
		}
		return (
			<div className={"Page " + className}>
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

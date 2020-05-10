import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleMenu } from '../store/actions';
import getCurrentScreenSize from '../lib/GetCurrentScreenSize';

class Page extends Component {

	constructor(props) {
		super(props)
		this.state = {
			screenSize: getCurrentScreenSize(),
		}
    window.addEventListener("resize", this.updateScreenSize)
  }

  updateScreenSize = () => {
    this.setState({
      screenSize: getCurrentScreenSize(),
    })
	}
	
	onClick = () => {
		if (this.props.showMenu && this.state.screenSize === "phone")
			this.props.toggleMenu()
	}

	render() {
		let className = this.props.className;
		if (this.props.showMenu) {
			className += " menuShown"
		} else {
			className += " menuHidden"
		}
		return (
			<div className={"Page " + className} onClick={this.onClick}>
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

function mapDispatchToProps(dispatch) {
	return {
		toggleMenu: () => dispatch(toggleMenu()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);

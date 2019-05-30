import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';
import { toggleMenu } from '../store/actions';
import { withRouter } from 'react-router-dom';
import PersonIcon from '@material-ui/icons/Person';
import List from '@material-ui/core/List';


class Header extends Component {

	constructor(props) {
		super(props);
	}

	logoClick = () => {
		this.props.history.push("/");
	}


	render() {
		return (
			<AppBar className="Header">
				<Toolbar>
					<IconButton color="inherit" aria-label="Menu" onClick={this.props.toggleMenu} style={{ position: "absolute" }} >
						<MenuIcon />
					</IconButton>
					<img src="/images/logo_qhighschool.svg" alt="QHighschool Logo" style={{ height: "60%", margin: "auto", maxHeight: "52px", cursor: "pointer" }} onClick={this.logoClick} />
					<List color="inherit" style={{ top: 15, right: 20, position: "absolute" }} onClick={this.handleClick}>
						<PersonIcon style={{ transform: "scale(1.5)", marginRight: "10px", float: "left" }} />
						<span className="HiddenOnMobile">
							{this.props.displayName}
						</span>
					</List>
				</Toolbar>
			</AppBar>
		);
	}
}

function mapStateToProps(state) {
	if (state.userId != null) {
		return {
			displayName: state.users[state.userId].displayName,
			userId: state.userId,
		};
	}
	return {
		displayName: "",
		userId: state.userId,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		toggleMenu: () => dispatch(toggleMenu()),
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));




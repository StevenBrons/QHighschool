import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { connect } from 'react-redux';
import { toggleMenu } from '../store/actions';
import { User } from '../lib/Data';
import { withRouter } from 'react-router-dom';

class Header extends Component {

	constructor(props) {
		super(props);
		this.state = { anchorEl: null };
	}

	handleClick = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	goToProfile() {
		this.handleClose();
		this.props.history.push("/gebruiker/" + this.props.userId);
	}

	logout() {
		User.logout().then(() => {
			document.location.reload();
		});
	}

	render() {
		const { anchorEl } = this.state;
		return (
			<AppBar className="Header">
				<Toolbar>
					<IconButton color="inherit" aria-label="Menu" onClick={this.props.toggleMenu}>
						<MenuIcon />
					</IconButton>
					<img src="/images/logo_qhighschool.svg" alt="QHighschool Logo" style={{height:"60%",margin:"auto"}}/>
					<Button color="inherit" style={{ right: 10, position: "absolute" }} onClick={this.handleClick}>{this.props.displayName}</Button>
				</Toolbar>
				<Menu
					id="simple-menu"
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={this.handleClose}
				>
					<MenuItem onClick={this.goToProfile.bind(this)}>Profiel</MenuItem>
					<MenuItem onClick={this.logout}>Log uit</MenuItem>
				</Menu>
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




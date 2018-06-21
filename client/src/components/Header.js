import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

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

	render() {
		const { anchorEl } = this.state;

		return (
			<AppBar className="Header">
				<Toolbar>
					<IconButton color="inherit" aria-label="Menu" onClick={this.props.handleShowMenu}>
						<MenuIcon />
					</IconButton>
						Q-Highschool
					<Button color="inherit" style={{ right: 10, position: "absolute" }} onClick={this.handleClick}>{this.props.email}</Button>
				</Toolbar>
				<Menu
					id="simple-menu"
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={this.handleClose}
				>
					<MenuItem onClick={this.handleClose}>Profiel</MenuItem>
					<MenuItem onClick={this.handleClose}>Log uit</MenuItem>
				</Menu>
			</AppBar>
		);
	}
}

export default Header;


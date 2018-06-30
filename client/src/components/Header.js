import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { toggleMenu } from '../store/actions';

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
					<IconButton color="inherit" aria-label="Menu" onClick={this.props.toggleMenu}>
						<MenuIcon />
					</IconButton>
					<Typography variant="title" color="inherit">
						Q-Highschool
					</Typography>
					<Typography variant="title" color="inherit">
						{this.props.location}
					</Typography>
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

function mapStateToProps(state) {
	if (state.userId != null) {
		return {
			email: state.users[state.userId].preferedEmail,
		};
	}
	return {
		email: "",
	};
}

function mapDispatchToProps(dispatch) {
	return {
		toggleMenu: () => dispatch(toggleMenu()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);




import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import filter from "lodash/filter";
import { ClickAwayListener } from '@material-ui/core';

import Field from '../components/Field';
import { getAllUsers } from '../store/actions';

class Menu extends Component {

	constructor(props) {
		super(props);
		this.state = {
			input: "",
			userId: null,
			open: false,
		}
	}

	componentDidMount() {
		this.props.getAllUsers();
	}

	selectUser = (userId, displayName) => {
		this.setState({
			input: displayName,
			open: false,
			userId: userId,
		});
		this.props.onChange(userId, displayName);
	}

	getFittingUsers = () => {
		const regExp = new RegExp(this.state.input.toLowerCase());
		let count = 0;
		return filter(this.props.users, (user) => {
			const v = regExp.test(user.displayName.toLowerCase())
			if (v) {
				count++;
			}
			return v && count < 6;
		}).map(user => {
			return (
				<MenuItem key={user.id + user.displayName} onClick={() => this.selectUser(user.id, user.displayName)}>
					{user.displayName}
				</MenuItem>
			);
		});
	}

	handleInput = (event) => {
		if (this.state.userId) {
			this.props.onChange(null, null);
		}
		this.setState({
			input: event.target.value,
			open: true,
			userId: null,
		});
	}

	render() {
		return (
			<ClickAwayListener onClickAway={() => this.setState({ open: false })}>
				<span>
					<Field label="Gebruiker" value={this.state.input} editable onChange={this.handleInput} style={{ margin: "normal" }} />
					<Popper open={this.state.aliasId == null && this.state.open} anchorEl={this.anchorEl} disablePortal>
						<Paper>
							<MenuList>
								{this.getFittingUsers()}
							</MenuList>
						</Paper>
					</Popper>
				</span>
			</ClickAwayListener>
		);
	}
}

function mapStateToProps(state) {
	return {
		users: state.users,
	}
}
function mapDispatchToProps(dispatch) {
	return {
		getAllUsers: () => dispatch(getAllUsers()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);


import React, { Component } from 'react';
import EnsureSecureLogin from '../components/EnsureSecureLogin';
import Field from '../components/Field';
import Page from './Page';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import filter from "lodash/filter"
import { connect } from 'react-redux';
import { setAlias } from "../store/actions"

class ControlPanel extends Component {

	constructor(props) {
		super(props);
		this.state = {
			alias: "",
			aliasId: null,
			aliasSelectOpen: true,
		}
	}

	handleAliasChange = (event) => {
		this.setState({
			alias: event.target.value,
			aliasId: null,
		});
	}

	handleClose = () => {
		this.setState({
			aliasSelectOpen: false,
		});
	}

	setAlias = (aliasId, displayName) => {
		this.setState({
			aliasId,
			alias: displayName,
		});
	}

	getFittingAliases = () => {
		const regExp = new RegExp(this.state.alias.toLowerCase());
		return filter(this.props.users, (user) => {
			return regExp.test(user.displayName.toLowerCase());
		}).map(user => {
			return (
				<MenuItem key={user.id + user.displayName} onClick={() => this.setAlias(user.id, user.displayName)}>
					{user.displayName}
				</MenuItem>
			);
		});
	}

	loginUsingAlias = () => {
		this.props.dispatch(setAlias(this.state.aliasId));
	}

	render() {
		return (
			<Page>
				<Paper
					elevation={2}
					style={{ position: "relative" }}
				>
					<Toolbar style={{ display: "flex" }}>
						<Typography variant="subheading" color="textSecondary" style={{ flex: "2 1 auto" }}>
							Control Panel
						</Typography>
					</Toolbar>
				</Paper>
				<EnsureSecureLogin>
					<Field label="naam" value={this.state.alias} editable onChange={this.handleAliasChange} style={{ margin: "normal" }} />
					<Popper open={this.state.aliasId == null && this.state.alias !== ""} anchorEl={this.anchorEl} disablePortal>
						<Paper>
							<MenuList>
								{this.getFittingAliases()}
							</MenuList>
						</Paper>
					</Popper>
					<Button variant="contained" color="primary" disabled={this.state.aliasId == null} onClick={this.loginUsingAlias}>Login in met alias</Button>
				</EnsureSecureLogin>
			</Page>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		users: state.users,
	}
}

export default connect(mapStateToProps)(ControlPanel);



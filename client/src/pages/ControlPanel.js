import React, { Component } from 'react';
import EnsureSecureLogin from '../components/EnsureSecureLogin';
import Page from './Page';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';
import { setAlias } from "../store/actions"
import SelectUser from '../components/SelectUser';

class ControlPanel extends Component {

	constructor(props) {
		super(props);
		this.state = {
			aliasId: null,
		}
	}

	loginUsingAlias = () => {
		this.props.dispatch(setAlias(this.state.aliasId));
	}

	handleAliasChange = (userId) => {
		this.setState({
			aliasId: userId,
		});
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
							Beheer
						</Typography>
					</Toolbar>
				</Paper>
				<EnsureSecureLogin>
					<SelectUser onChange={this.handleAliasChange} />
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



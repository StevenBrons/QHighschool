import React, { Component } from 'react';
import Page from '../Page';
import { Typography, Divider } from '@material-ui/core/';
import EducationData from "./EducationData"
import PersonalData from "./PersonalData"
import Progress from "../../components/Progress"

import { connect } from 'react-redux';
import LoginProvider from '../../lib/LoginProvider';
import "./Profile.css";

class Profile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: {}
		}
	}

	onChange = (field, value) => {
		this.setState({
			user: {
				...this.state.user,
				[field]: value,
			}
		})
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			orgUser: nextProps.user,
			user: {
				...nextProps.user,
				...prevState.user
			}
		}
	}

	render() {
		const user = this.state.user;
		if (user == null || user == {}) {
			return <LoginProvider>
				<Page>
					<Progress />
				</Page>
			</LoginProvider>
		}
		return (
			<LoginProvider>
				<Page className="Profile">
					<Typography variant="h4" color="primary">
						{user.displayName}
					</Typography>
					<Divider />
					<PersonalData {...user} onChange={this.onChange} />
					<EducationData  {...user} onChange={this.onChange} />
				</Page>
			</LoginProvider>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		user: state.users[state.userId],
	}
}

function mapDispatchToProps(dispatch) {
	return {
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
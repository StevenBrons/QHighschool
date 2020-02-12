import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from '../Page';
import { Typography, Divider } from '@material-ui/core/';
import Progress from "../../components/Progress"

import PersonalData from "./PersonalData"
import EducationData from "./EducationData"
import ExamSubjects from "./ExamSubjects"
import Remarks from "./Other"
import LoginProvider from '../../lib/LoginProvider';
import "./Profile.css";
import Saveable from '../../components/Saveable';
import { setUser, setFullUser } from '../../store/actions';

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
		const hasChanged = JSON.stringify(this.props.user) !== JSON.stringify(user);
		const p = { ...this.props, user }

		if (user == null || user === {}) {
			return <LoginProvider>
				<Page>
					<Progress />
				</Page>
			</LoginProvider>
		}
		return (
			<LoginProvider>
				<Page className="Profile">
					<Saveable
						hasChanged={hasChanged}
						onSave={() => {
							if (this.props.editableAdmin) {
								this.props.saveFull(user)
							} else {
								this.props.save(user)
							}
						}}
						editIfSecure={this.props.isAdmin}
						isSecure={this.props.isSecure}
					>
						<Typography variant="h4" color="primary">
							{user.displayName}
						</Typography>
						<Divider />
						<div>
							<PersonalData {...p} onChange={this.onChange} />
							<EducationData  {...p} onChange={this.onChange} />
							<ExamSubjects {...p} onChange={this.onChange} />
							<Remarks {...p} onChange={this.onChange} />
							<div style={{ height: "300px" }} />
						</div>
					</Saveable>
				</Page>
			</LoginProvider>
		);
	}
}

function mapStateToProps(state, ownProps) {
	const isOwn = true;
	const isAdmin = state.role === "admin"
	const isSecure = state.secureLogin != null;
	return {
		isAdmin,
		isSecure,
		isOwn,
		user: state.users[state.userId],
		editableUser: (isOwn && !isAdmin) || (isSecure && isAdmin),
		editableAdmin: isSecure && isAdmin,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		save: (user) => dispatch(setUser(user)),
		saveFull: (user) => dispatch(setFullUser(user)),
	};
}



export default connect(mapStateToProps, mapDispatchToProps)(Profile);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from '../Page';
import { Typography, Divider } from '@material-ui/core/';
import { PriorityHigh } from "@material-ui/icons";
import Progress from "../../components/Progress"

import PersonalData from "./PersonalData"
import EducationData from "./EducationData"
import ExamSubjects from "./ExamSubjects"
import OtherData from "./OtherData"
import Remarks from "./Other"
import LoginProvider from '../../lib/LoginProvider';
import "./Profile.css";
import Saveable from '../../components/Saveable';
import { setUser, setFullUser, setSecureLogin, getCookie } from '../../store/actions';
import queryString from "query-string";
import { withRouter } from 'react-router-dom';

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
		let s = queryString.parse(nextProps.location.search);
		if (s.secureLogin != null && s.secureLogin !== "undefined") {
			nextProps.setSecureLogin(s.secureLogin);
		}
		if (s.from === "login" && nextProps.user != null && nextProps.role !== "student") {
			const beforeLoginPath = getCookie("beforeLoginPath");
			nextProps.history.push(beforeLoginPath);
		}
		return {
			orgUser: nextProps.user,
			user: {
				...nextProps.user,
				...prevState.user,
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
						hasChanged={hasChanged || (user.needsProfileUpdate && user.role === "student")}
						onSave={() => {
							if (this.props.editableAdmin) {
								this.props.saveFull(user)
							} else {
								const U = {
									...user,
									needsProfileUpdate: false,
								}
								this.props.save(U)
								this.setState({
									user: U,
								});
							}
						}}
						editIfSecure={!this.props.isStudent}
						isSecure={this.props.isSecure}
					>
						<Typography variant="h4" color="primary">
							{user.displayName}
						</Typography>
						<Divider />
						{user.needsProfileUpdate &&
							< div className="NeedsProfileUpdate">
								<PriorityHigh color="secondary" />
								<Typography variant="button" color="secondary">
									Controleer de onderstaande gegevens
						</Typography>
							</div>
						}
						<div>
							<PersonalData {...p} onChange={this.onChange} />
							<OtherData {...p} onChange={this.onChange} />
							<EducationData  {...p} onChange={this.onChange} />
							{this.props.isStudent &&
								<ExamSubjects {...p} onChange={this.onChange} />
							}
							<Remarks {...p} onChange={this.onChange} />
							<div style={{ height: "300px" }} />
						</div>
					</Saveable>
				</Page>
			</LoginProvider >
		);
	}
}

function mapStateToProps(state, ownProps) {
	const isOwn = true;
	const isStudent = state.role === "student";
	const isAdmin = state.role === "admin";
	const isSecure = state.secureLogin != null;
	return {
		isAdmin,
		isSecure,
		isStudent,
		isOwn,
		user: state.users[state.userId],
		editableUser: (isOwn && isStudent)  || (isOwn && isSecure) || (isSecure && isAdmin),
		editableAdmin: isSecure && isAdmin,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setSecureLogin: (secureLogin) => dispatch(setSecureLogin(secureLogin)),
		save: (user) => dispatch(setUser(user)),
		saveFull: (user) => dispatch(setFullUser(user)),
	};
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
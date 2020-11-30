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
import LoginProvider from '../../lib/LoginProvider';
import "./Profile.css";
import Saveable from '../../components/Saveable';
import { setSelf, setUser, setSecureLogin, getCookie, getUser } from '../../store/actions';
import queryString from "query-string";
import { withRouter } from 'react-router-dom';

class Profile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: {}
		}
	}

	componentDidMount = () => {
		if (this.state.user == null || !this.props.isOwn) {
			this.props.getUser(this.props.userId);
		}
	}

	componentDidUpdate = () => {
		if (this.state.user == null) {
			this.props.getUser(this.props.userId);
		}
	}

	onChange = (field, value) => {
		console.log(field, value);
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
		if (prevState.userId === nextProps.userId) {
			return {
				orgUser: nextProps.user,
				user: {
					...nextProps.user,
					...prevState.user,
				},
				userId: nextProps.userId,
			}
		} else {
			return {
				orgUser: nextProps.user,
				user: nextProps.user,
				userId: nextProps.userId,
			}

		}
	}

	render() {
		const user = this.state.user;
		const hasChanged = JSON.stringify(this.props.user) !== JSON.stringify(user);
		const p = { ...this.props, user }

		if (user == null || user.id == null) {
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
						hasChanged={hasChanged || (user.needsProfileUpdate === true && user.role === "student")}
						onSave={() => {
							if (this.props.editableAdmin) {
								this.props.setUser(user)
							} else {
								const U = {
									...user,
									needsProfileUpdate: false,
								}
								this.props.setSelf(U)
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
							{user.role === "student" &&
								<ExamSubjects {...p} onChange={this.onChange} />
							}
							<div style={{ height: "300px" }} />
							<Typography>
								In onze <a href="https://www.quadraam.nl/privacy">privacyverklaring</a> is meer te lezen over het gebruik van deze gegevens.
							</Typography>
						</div>
					</Saveable>
				</Page>
			</LoginProvider >
		);
	}
}

function mapStateToProps(state, ownProps) {
	let isOwn;
	const isStudent = state.role === "student";
	const isAdmin = state.role === "admin";
	const isGradeAdmin = state.role === "grade_admin";
	const isSecure = state.secureLogin != null;
	let userId = ownProps.match.params.userId;
	if (userId == null) {
		isOwn = true;
		userId = state.userId;
	} else {
		isOwn = false;
	}
	const school = state.users[state.userId].school;
	const user = state.users[userId];
	const editableAdmin = isSecure && (isAdmin || (user && user.school === school && isGradeAdmin))

	// Basic: 		student
	// Full : 		teacher, grade_admin, admin

	return {
		isAdmin,
		isSecure,
		isStudent,
		isFull: isOwn || isAdmin,
		user,
		editableUser: (isOwn && isStudent) || (isOwn && isSecure) || editableAdmin,
		editableAdmin,
		userId,
		isOwn,
	}
}

function mapDispatchToProps(dispatch, ownProps, state) {
	return {
		setSecureLogin: (secureLogin) => dispatch(setSecureLogin(secureLogin)),
		setSelf: (user) => dispatch(setSelf(user)),
		setUser: (user) => dispatch(setUser(user)),
		getUser: (userId) => dispatch(getUser(userId)),
	};
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
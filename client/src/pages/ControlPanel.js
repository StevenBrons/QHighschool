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
import { Divider } from '@material-ui/core';
import Field from '../components/Field';

class ControlPanel extends Component {

	constructor(props) {
		super(props);
		this.state = {
			aliasId: null,
			subject:{
				name:"",
				description:"",
			},
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


	handleChange = (event) => {
		this.setState({
			subject: {
				...this.state.group,
				[event.name]: event.target.value,
			}
		});
	}

	render() {
		return (
			<Page>
				<EnsureSecureLogin>
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
					<div style={{margin:"10px 0"}}>
						<Button variant="contained" color="primary" disabled={this.state.aliasId == null} onClick={this.loginUsingAlias}>Login in met alias</Button>
					</div>
					<Divider/>
					<div style={{display:"flex" , flexDirection:"column"}}>
						<div style={{display:"flex"}}>
							<Typography variant="subheading" style={{flex: "1"}}>
								Vak:
							</Typography>
							<Field label={"Naam"} editable={true} style={{flex:"5"}}/>
						</div>
							<Field  layout={{area:true}} value={this.state.subject.description} label={"Beschrijving"} name="description" onChange={this.handleChange} editable={true} style={{flex:"4"}}/>
							<Button style={{width:"100px"}}>
								add
							</Button>
					</div>
					<Divider/>
				</EnsureSecureLogin>
			</Page>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
	}
}

function mapDispatchToProps(dispatch) {
	return {
		addSubject: async (name, description) => { console.log("ADD SUBJECT"); return { sucess: true } },
		addCourse: async (name, subjectId) => { console.log("ADD COURSE"); return { sucess: true } },
		addGroup: async (courseId, userId) => { console.log("ADD GROUP"); return { sucess: true } },
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);



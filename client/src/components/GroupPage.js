import React, { Component } from 'react';
import { withRouter } from 'react-router';

import theme from '../MuiTheme'

import Typography from '@material-ui/core/Typography';
import ChooseButton from './ChooseButton';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Field from './Field';

import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { createMuiTheme } from '@material-ui/core';

class GroupPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentTab: 0,
		}
	}

	handleTab = (event, currentTab) => {
		this.setState({ currentTab });
	};

	render() {
		const group = this.props.group;
		return (
			<div className="Page" style={this.state.style}>
				<Field value={group.subjectName} right headline/>
				<Field value={group.courseName} headline/>
				<br/>
				<Field value={group.teacherName} right/>
				<Field value={"Periode " + group.period} caption style={{width:"100px"}}/>
				<Field value={group.day} caption/>
				<br/>
				<Field value={group.courseDescription} area/>
				<Divider />
				<ChooseButton
					group={group}
					style={{ margin: "20px" }}
				/>
				<Divider />
				<AppBar position="static" color="default">
					<Tabs
						value={this.state.currentTab}
						onChange={this.handleTab}
						indicatorColor="primary"
						textColor="primary"
						fullWidth
						centered
					>
						<Tab label="Aanmeldingen" />
						<Tab label="Deelnemers" />
						<Tab label="Lessen" />
						<Tab label="Presentie" />
						<Tab label="Beoordeling" />
					</Tabs>
				</AppBar>
			</div >
		);
	}

}


export default withRouter(GroupPage);


import React, { Component } from 'react';
import { withRouter } from 'react-router';

import ChooseButton from '../components/ChooseButton';
import Field from '../components/Field';

import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class GroupPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentTab: 0,
		}
	}

	componentWillMount() {
		this.props.getGroupEnrollments(this.props.group.id);
	}

	handleTab = (event, currentTab) => {
		this.setState({ currentTab });
	};

	render() {
		const group = this.props.group;
		return (
			<div className="Page" style={this.state.style}>
				<Field value={group.subjectName} right headline />
				<Field value={group.courseName} headline />
				<br />
				<Field value={group.teacherName} right />
				<Field value={"Periode " + group.period} caption style={{ width: "100px" }} />
				<Field value={group.day} caption />
				<br />
				<Field value={group.courseDescription} area />
				<Divider />
				{this.props.role === "student" &&
					<ChooseButton
						group={group}
						style={{ margin: "20px" }}
					/>
				}
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
						{this.props.role === "teacher" && <Tab label="Aanmeldingen" />}
						<Tab label="Lessen" />
						<Tab label="Deelnemers" />
						{this.props.role === "teacher" && <Tab label="Presentie" />}
						{this.props.role === "teacher" && <Tab label="Beoordeling" />}
					</Tabs>
				</AppBar>
			</div >
		);
	}

}


export default withRouter(GroupPage);


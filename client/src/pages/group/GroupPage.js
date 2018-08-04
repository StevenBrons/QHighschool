import React, { Component } from 'react';
import { withRouter } from 'react-router';

import ChooseButton from './ChooseButton';
import Field from '../../components/Field';
import User from "../User"

import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';



class GroupPage extends Component {

	constructor(props) {
		super(props);
		const studentTabs = ["Lessen"];
		const teacherTabs = ["Inschrijvingen","Lessen","Deelnemers","Activiteit","Beoordeling"];
		this.state = {
			currentTab: 0,
			tabs: this.props.role === "teacher" ? teacherTabs : studentTabs,
			editable:false,
		}
	}

	getCurrentTab(currentTab) {
		switch (this.state.tabs[currentTab]) {
			case "Inschrijvingen":
				if (this.props.group.enrollments == null) {
					this.props.getGroupEnrollments(this.props.group.id);
					return null;
				}
				return this.props.group.enrollments.map(enrollment => {
					return <User key={enrollment.id} userId={enrollment.id} display="row" />
				});
			default: return null;
		}

	}

	setEditable() {
		this.setState({
			editable:true,
		});
	}

	handleTab = (event, currentTab) => {
		this.setState({ currentTab });
	};

	render() {
		const group = this.props.group;
		const editable = this.state.editable;
		return (
			<div className="Page" style={this.state.style}>
				<Field value={group.subjectName} right headline editable={editable}/>
				<Field value={group.courseName} headline  editable={editable}/>
				<br />
				<Field value={group.teacherName} right  editable={editable}/>
				<Field value={"Periode " + group.period} caption style={{ width: "100px" }}  editable={editable}/>
				<Field value={group.day} caption  editable={editable}/>
				<br />
				<Field value={group.courseDescription} area  editable={editable}/>
				<Divider />
				{this.props.role === "student" &&
					<ChooseButton
						group={group}
						style={{ margin: "20px" }}
					/>
				}
				{this.props.role === "teacher" &&
					<Button color="secondary" variant="contained" style={{ margin: "20px" }} onClick={this.setEditable.bind(this)}>
						{"Bewerken"}
					</Button>
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
						{this.state.tabs.map(tab => <Tab key={tab} label={tab} />) }
					</Tabs>
				</AppBar>
				<br/>
				<div style={{ width: "95%", margin: "auto" }}>
					{this.getCurrentTab(this.state.currentTab)}
				</div>
			</div>
		);
	}

}


export default withRouter(GroupPage);


import React from 'react';
import Page from './Page';
import { Course, User } from "../Data";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ChooseButton from '../components/ChooseButton';

class CourseSelect extends Page {

	constructor(props) {
		super(props);
		this.state = {
			course: {},
			choices: [],
			currentTab: 0,
		}
		if (this.props.course != null) {
			this.state.course = this.props.course;
		}
	}

	handleChange = (event, currentTab) => {
		this.setState({ currentTab });
	};

	componentWillMount() {
		const courseId = 5;
		Course.get(courseId)
			.then(course => this.setState({ course: course }))
			.then(User.getChoices())
			.then(choices => {
				choices.forEach(c => {
					if (c.id === this.state.course.id) {
						this.setState({ chosen: true });
					}
				});
				this.setState({ choices: choices });
			});
	}


	render() {
		let course = this.state.course;
		return (
			<div className="Page" style={this.state.style} >
				<div style={{ float: "right", textAlign: "right" }}>
					<Button color="primary" size="large">
						{course.teacherName}
					</Button>
					<Typography variant="subheading" color="textSecondary" style={{ transform: "translate(-25px,0)" }}>
						{course.schoolYear}
					</Typography>
				</div>
				<Typography variant="headline" color="primary">
					{course.name}
				</Typography>
				<Typography variant="subheading" color="textSecondary">
					{"Periode " + course.period + " - " + course.day}
				</Typography>
				<Typography variant="subheading" color="textSecondary">
					{course.subjectName}
				</Typography>
				<Divider />
				<br />
				<Typography variant="body" color="text" paragraph>
					{course.description}
				</Typography>
				<Divider />
				<ChooseButton
					course={course}
					style={{margin:"20px"}}
				/>
				<Divider />
				<AppBar position="static" color="default">
					<Tabs
						value={this.state.currentTab}
						onChange={this.handleChange}
						indicatorColor="primary"
						textColor="primary"
						fullWidth
						centered
					>
						<Tab label="Lessen" />
						<Tab label="Activiteit" />
						<Tab label="Beoordeling" />
					</Tabs>
				</AppBar>
			</div>
		);
	}
}

export default CourseSelect;


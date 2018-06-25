import React from 'react';
import Page from './Page';
import { Course, User, Subject } from "../Data";
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
			choices:[],
			currentTab:0,
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
		if (this.props.course === undefined) {
			Course.get(courseId).then(course => {
				this.setState({ course: course })
			});
		}
	}


	render() {
		let course = this.state.course;
		return (
			<div className="Page" style={this.state.style}>
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
					choices={this.props.choices}
					onChoose={this.props.onChoose}
				/>
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
				{/* <TextField
          id="name"
          label="Name"
          value={"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. "}
					margin="normal"
					multiline
					disabled
          rowsMax="4"
					fullWidth
        /> */}

			</div>
		);
	}
}

export default CourseSelect;


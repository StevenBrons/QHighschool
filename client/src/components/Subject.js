import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CourseChoice from '../components/CourseChoice';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

class Subject extends Component {

	constructor(props) {

		super(props);
		this.state = {
			extended: this.props.extended ? true : false,
			canCollapse: true,
			style: {
				width: "95%",
				height: "auto",
				padding: "20px",
				margin: "20px",
				display: "inline-block",
				cursor: "pointer",
			},
		}
	}

	onClick() {
		if (this.state.canCollapse) {
			this.setState({
				extended: !this.state.extended,
			});
		}
	}

	preventCollapse(preventCollapse) {
		this.setState({ canCollapse: !preventCollapse });
	}

	render() {
		let courses;
		if (this.state.extended) {

			courses = this.props.courses.map((course) => {
				return (
					<CourseChoice
						course={course}
						choices={this.props.choices}
						preventCollapse={this.preventCollapse.bind(this)}
						onChoose={this.props.onChoose}
					/>
				);
			});
		}
		return (
			<Paper
				className="Course"
				elevation={this.state.hover ? 2 : 1}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
				style={this.state.style}
				onClick={this.onClick.bind(this)}
			>
				<IconButton aria-label="Delete" style={{ float: "right" }}>
					<ExpandLess />
				</IconButton>
				<Typography variant="headline" color="primary" gutterBottom>
					{this.props.subject.name}
				</Typography>
				<Typography variant="body" color="inherit">
					{this.props.subject.description}
				</Typography>
				<br />
				{courses}
			</Paper >
		);
	}
}

export default Subject;


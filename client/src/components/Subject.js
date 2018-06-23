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
			style: {
				width: "95%",
				height: "auto",
				padding: "20px",
				margin: "20px",
				display: "inline-block",
				cursor: "pointer",
			}
		}
	}

	onClick() {
		this.setState({
			extended: !this.state.extended,
		});
	}

	render() {
		if (this.state.extended) {

			const courses = this.props.courses.map((course) => {
				return (
					<CourseChoice
						course={course}
						choices={this.props.choices}
					/>
				);
			});

			return (
				<Paper
					className="Course"
					elevation={this.state.hover ? 8 : 2}
					onMouseEnter={() => this.setState({ hover: true })}
					onMouseLeave={() => this.setState({ hover: false })}
					style={this.state.style}
					onClick={this.onClick.bind(this)}
				>
					<IconButton aria-label="Delete" style={{float:"right"}}>
						<ExpandLess />
					</IconButton>
					<Typography variant="headline" color="primary" gutterBottom>
						{this.props.subject.name}
					</Typography>
					<Typography variant="body1" color="inherit">
						{this.props.subject.description}
					</Typography>
					<br/>
					{courses}
				</Paper >
			);
		} else {
			return (
				<Paper
					className="Course"
					elevation={this.state.hover ? 8 : 2}
					onMouseEnter={() => this.setState({ hover: true })}
					onMouseLeave={() => this.setState({ hover: false })}
					style={this.state.style}
					onClick={this.onClick.bind(this)}
				>
				<IconButton aria-label="Delete" style={{float:"right"}}>
					<ExpandMore />
				</IconButton>
				<Typography variant="headline" color="primary" gutterBottom>
					{this.props.subject.name}
				</Typography>
				<Typography variant="body1" color="inherit">
					{this.props.subject.description}
				</Typography>

				</Paper >
			);
		}
	}

}

export default Subject;


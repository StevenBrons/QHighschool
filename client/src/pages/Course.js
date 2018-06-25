import React from 'react';
import Page from './Page';
import { Course, User, Subject } from "../Data";

class CourseSelect extends Page {

	constructor(props) {
		super(props);
		this.state = {
			course: {

      },
      subject: {

      },
		}

	}
	componentWillMount() {
		console.log(this.props);
	}


	render() {
		return (
			<div className="Page" style={this.state.style}>
				
			</div>
		);
	}
}

export default CourseSelect;


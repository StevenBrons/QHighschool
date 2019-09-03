import React, {Component} from 'react';

class Course extends Component {

	render() {
		console.log(this.props);
		return (
			<div style={{height:'100px', width:'200px', background:'red'}}>
				Dit is een course {this.props.text}
			</div>
		)
	}
}

export default Course;
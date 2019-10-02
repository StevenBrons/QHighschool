import React, {Component} from 'react';
import './Course.css';

class Course extends Component {

	render() {
		return (
			<button 
				className = {'Course' + (this.props.large ? ' large' : '')}
				onMouseEnter={this.onMousEnter}
				onMouseLeave={this.onMouseLeave}
				onClick={this.props.onClick}
				>
				{this.props.text}
			</button>
		)
	}
}

export default Course;
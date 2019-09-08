import React, {Component} from 'react';
import './Course.css';

class Course extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hover: false,
		}
	}

	onMousEnter = () => {
		this.setState({hover:true});
	}

	onMouseLeave = () => {
		this.setState({hover:false});
	}

	render() {
		return (
			<button 
				// className= {'Course' + (this.state.hover ?' hover' : '')} 
				className = 'Course'
				onMouseEnter={this.onMousEnter}
				onMouseLeave={this.onMouseLeave}
				onClick={this.props.onClick}
				>
				Dit is een course {this.props.text}
			</button>
		)
	}
}

export default Course;
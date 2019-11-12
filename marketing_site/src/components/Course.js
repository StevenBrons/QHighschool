import React, {Component} from 'react';
import './Course.css';

class Course extends Component {

	constructor(props){
		super(props);
		const colors = [' purple', ' pink', ' blue', ' orange', ' red', ' green', ' yellow'];
		const color = colors[Math.floor(Math.random() * 7)];
		this.state = {
			color: color
		}
	}

	render() {
		const {selected, large, text, onClick} = this.props;
		const color = this.state.color;
		const id = 11;//TODO: replace with actual id
		return (
			<div
				className = {'Course' + (large ? ' large' : '') + (selected ? ' selected' : '') + color}
				onClick={onClick}
				style={{backgroundImage:`url(https://q-highschool.nl/wp-content/uploads/thumbnail_course_${id}.jpg)`}}
				>
				<h2
					className = 'text'
					>
					{text}
				</h2>
				<img 
					className="q-logo"
					src='q.svg'
					alt=""
				/>
					{selected && 
						<div className='arrow'/>
					}
			</div>
		)
	}
}

export default Course;
import React, {Component} from 'react';
import './Course.css';

class Course extends Component {

	render() {
		const {selected, large, text, onClick} = this.props;
		const id = 11;//TODO: replace with actual id
			// </img>
		return (
			<div
				className = {'Course' + (large ? ' large' : '') + (selected ? ' selected' : '')}
				onClick={onClick}
				style={{backgroundImage:`url(https://q-highschool.nl/wp-content/uploads/thumbnail_course_${id}.jpg)`}}
				>
				<h1 
					className = 'text'
					>
					{text}
				</h1>
					{selected && 
						<div className='arrow'/>
					}
			</div>
		)
	}
}

export default Course;
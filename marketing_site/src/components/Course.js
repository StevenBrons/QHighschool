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
				>
				<img 
					className = 'image'
					alt={""}
					src = {`https://q-highschool.nl/wp-content/uploads/thumbnail_course_${id}.jpg`}
					/>
					{text}
					{selected && 
						<div className='arrow'/>
					}
			</div>
		)
	}
}

export default Course;
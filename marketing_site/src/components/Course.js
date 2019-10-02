import React, {Component} from 'react';
import './Course.css';

class Course extends Component {

	render() {
		const {selected, large, text, onClick} = this.props;
		return (
			<button 
				className = {'Course' + (large ? ' large' : '') + (selected ? ' selected' : '')}
				onClick={onClick}
				>
				{text}
				{selected && 
					<div className='arrow'/>
				}
			</button>
		)
	}
}

export default Course;
import React, {Component} from 'react';
import './SubjectInfo.css';

class CourseInfo extends Component {

	render() {
		let {previousSubject, nextSubject, subject, onClose} = this.props;
		return (
			<div
				className='SubjectInfo'
			>
				{previousSubject && 
				<button
					className='previous-subject'
					onClick={previousSubject}
				>
					{'<'}
				</button>
				}
				<h1>HOI HIER IS INFORMATIE OVER {subject}</h1>
				{nextSubject && 
				<button
					className='next-subject'
					onClick={nextSubject}
				>
					{'>'}
				</button>
				}
				<button 
					className='close-button' 
					onClick={onClose} 
					style={{background:'url(close-button.svg)'}}
				/>
			</div>
		)
	}
}

export default CourseInfo;
import React, {Component} from 'react';
import './SubjectInfo.css';

class SubjectInfo extends Component {

	render() {
		let {previousSubject, nextSubject, subject, onClose, description} = this.props;
		return (
			<div
				className='SubjectInfo'
			>
				<div className='button-container'>
					{previousSubject && 
					<div
						className='button previous-subject'
						onClick={previousSubject}
					/>
					}
				</div>
				<div className='text'>
					<h1 className='title'>Waar gaat het vak {subject} over?</h1>
					<p>{description}</p>

				</div>
				<div className='button-container'>
					{nextSubject && 
					<div
						className='button next-subject'
						onClick={nextSubject}
					/>
					}
				</div>
				<button 
					className='close-button' 
					onClick={onClose} 
				/>
			</div>
		)
	}
}

export default SubjectInfo;
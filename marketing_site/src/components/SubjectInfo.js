import React, {Component} from 'react';
import './SubjectInfo.css';

class CourseInfo extends Component {

	render() {
		let {previousSubject, nextSubject, subject, onClose} = this.props;
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
					<h1 className='title'>Waar gaat het vak {subject.toLowerCase()} over?</h1>
					<p className='tempting-sentence'>
						Hier een korte verleidelijke onderwerpregel
					</p>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
						Suspendisse enim quam, varius sit amet mollis et, aliquam at dui.
						 In hac habitasse platea dictumst. Vestibulum rutrum convallis elit, vitae placerat nunc rutrum sit amet.
						  In ut turpis suscipit, convallis dui convallis, fermentum enim.
							 Nam elit risus, aliquet posuere neque ut, faucibus vehicula purus.
							  Cras mollis erat orci, in sodales augue varius eget.
							  Pellentesque faucibus diam eu arcu congue finibus. Pellentesque feugiat eget mauris sed placerat.</p>

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
					style={{background:'url(close-button.svg)'}}
				/>
			</div>
		)
	}
}

export default CourseInfo;
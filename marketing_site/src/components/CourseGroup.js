import React, {Component} from 'react';
import Course from './Course';
import './CourseGroup.css'; 

class CourseGroup extends Component {

	constructor(props) {
		super(props);
		this.scroller = React.createRef();
	}

	scrollToLeft = () => {
		this.scroller.current.scrollLeft -= this.scroller.current.offsetWidth * 0.96; // * 0.96 because there is 2% on both sides
	}

	scrollToRight = () => {
		this.scroller.current.scrollLeft += this.scroller.current.offsetWidth  * 0.96; // * 0.96 because there is 2% on both sides
	}

	render() {
		const {courses, selectedCourse} = this.props;
		return (
			<div 
				className='CourseGroup'
			>
				<h3
					className='title'
					onClick={()=>{}}//TODO
				>
					{this.props.title}
				</h3>
				<button
					className='scroll-left'
					onClick={this.scrollToLeft}
				>
					{'<'}
				</button>
				<div
					ref={this.scroller}
					className='scroller'
				>
					{Object.keys(courses).map(id => {
						return <Course 
									key={id} 
									class='course' 
									onClick={_ => this.props.onClick(id)} 
									text={courses[id].courseName.toUpperCase()} 
									selected = {selectedCourse === id}
									large = {this.props.large}
								/>
					})}
				</div>
				<button
					className='scroll-right'
					onClick={this.scrollToRight}
				>
					{'\u276f'}
				</button>
			</div>
		)
	}
}

export default CourseGroup;
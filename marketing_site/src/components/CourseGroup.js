import React, {Component} from 'react';
import Course from './Course';
import './CourseGroup.css'; 

class CourseGroup extends Component {

	constructor(props) {
		super(props);
		this.scroller = React.createRef();
		this.title = React.createRef();
		let maxPage = Math.floor((Object.keys(props.courses).length - 1 ) / 4);
		this.state = {
			page: 0,
			maxPage: maxPage
		}
		if (maxPage > 0) window.addEventListener('resize', () => this.scrollToPage(this.state.page));
	}

	scrollToPage(page) {
		let scroller = this.scroller.current;
		const margin = this.title.current.offsetLeft;
		scroller.scrollLeft = scroller.children[4*page].offsetLeft - margin;
		this.setState({
			page: page
		})
	}

	render() {
		const {courses, selectedCourse, showSubjectInfo} = this.props;
		const {page, maxPage} = this.state;
		return (
			<div 
				className='CourseGroup'
			>
				<h3
					className='title'
					ref={this.title}
					onClick={showSubjectInfo}
				>
					{this.props.title}
				</h3>
				{ page !== 0 && 
					<div
						className='scroll-button left'
						onClick={() => this.scrollToPage(page-1)}
					/>
				}
				<div
					className='scroller'
					ref={this.scroller}
				>
					{Object.keys(courses).map(id => {
						return <Course 
									key={id} 
									id={id}
									class='course' 
									onClick={_ => this.props.onClick(id)} 
									text={courses[id].courseName.toUpperCase()} 
									selected = {selectedCourse === id}
									large = {this.props.large}
								/>
					})}
				</div>
				{page !== maxPage && 
					<div
						className='scroll-button right'
						onClick={() => this.scrollToPage(page+1)}
					/>
				}
			</div>
		)
	}
}

export default CourseGroup;
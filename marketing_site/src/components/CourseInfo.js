import React, { Component } from 'react';
import './CourseInfo.css';

class CourseInfo extends Component {

  render() {
    return (
      <div className='CourseInfo'>
		  <h1>
			  Informatie over module {this.props.course} van {this.props.group}
		  </h1>
		  <button onClick={this.props.onClose}>
			  X
		  </button>
      </div>
    )
  }
}

export default CourseInfo;

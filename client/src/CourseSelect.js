import React, { Component } from 'react';
import Course from './Course';

class CourseSelect extends Component {

    render() {
        var courses = this.props.courses.map((course) => {
            return <Course onChoose={this.props.onChoose} course={course} maxCources={this.props.maxCources} chosenCourcesCount={this.props.chosenCourcesCount}/>
        });

        return (
            <div className="CourseSelect">
                {courses}
            </div>
        );
    }
}

export default CourseSelect;


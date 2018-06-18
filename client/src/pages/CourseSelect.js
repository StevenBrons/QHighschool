import React, { Component } from 'react';
import CourseChoice from '../components/CourseChoice';

class CourseSelect extends Component {

    constructor(props) {
        super(props);

        this.state = {
            maxChoices: 2,
            courses: [
                {
                    title: "Informatica",
                    period: 3,
                    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
                    chosen: false,
                    chosenNum: 0,
                    key:0,
                },
                {
                    title: "Filosofie",
                    period: 3,
                    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
                    chosen: false,
                    chosenNum: 0,
                    key:1,
                },
                {
                    title: "Spaans",
                    period: 3,
                    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
                    chosen: false,
                    chosenNum: 0,
                    key:2,
                },
                {
                    title: "Tekenen",
                    period: 3,
                    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
                    chosen: false,
                    chosenNum: 0,
                    key:3,
                },
            ],
            choices: [],
        }

    }

    handleCourseChoose(course) {
        var courses = this.state.courses;
        let i = this.state.courses.indexOf(course);
        courses[i].chosen = !courses[i].chosen;
        let c = this.countChosenCourses(courses);
        courses[i].chosenNum = c;
        this.setState({
          courses: courses,
        });
      }


    render() {
        const chosenCoursesCount = this.state.courses.filter(course => course.chosen === true).length;

        var courses = this.state.courses.map((course) => {
            return <CourseChoice
                course={course}
                choices={this.state.choices}
                onChoose={this.handlecourseChoose}
                maxChoices={this.state.maxChoices}
            />
        });

        return (
            <div className="CourseSelect">
                {courses}
            </div>
        );
    }
}

export default CourseSelect;


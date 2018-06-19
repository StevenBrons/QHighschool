import React, { Component } from 'react';
import CourseChoice from '../components/CourseChoice';

class CourseSelect extends Component {

    constructor(props) {
        super(props);

        this.state = {
            maxChoices: 3,
            courses: [
                {
                    title: "Informatica",
                    period: 3,
                    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
                    chosen: false,
                    chosenNum: 0,
                    key: 0,
                },
                {
                    title: "Filosofie",
                    period: 3,
                    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
                    chosen: false,
                    chosenNum: 0,
                    key: 1,
                },
                {
                    title: "Spaans",
                    period: 3,
                    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
                    chosen: false,
                    chosenNum: 0,
                    key: 2,
                },
                {
                    title: "Tekenen",
                    period: 3,
                    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
                    chosen: false,
                    chosenNum: 0,
                    key: 3,
                },
            ],
            choices: [],
        }

    }

    handleCourseChoose(course) {
        const index = this.state.choices.indexOf(course.key)
        if (index === -1) {
            this.setState({
                choices:this.state.choices.concat(course.key),
            });
        }else {
            let c = this.state.choices.slice();
            c.splice(index,1);
            this.setState({
                choices:c,
            });
        }

    }


    render() {
        const chosenCoursesCount = this.state.courses.filter(course => course.chosen === true).length;
        var courses = this.state.courses.map((course) => {
            return <CourseChoice
                course={course}
                choices={this.state.choices}
                onChoose={this.handleCourseChoose.bind(this)}
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


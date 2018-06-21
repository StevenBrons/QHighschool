import React, { Component } from 'react';
import CourseChoice from '../components/CourseChoice';
import { Course,User } from "../Data";

class CourseSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
						maxChoices: 3,
						courses:[],
            choices: [],
        }

    }

    componentWillMount() {
      Course.getChoices().then(data => {
				if (data.error !== null) {
					this.setState({courses:data});
				}
			});
			User.getChoices(this.props.token).then(data => {
				if (data.error !== null) {
					this.setState({choices:data});
				}
			});
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
        var courses = this.state.courses.map((course) => {
            return <CourseChoice
                course={course}
                choices={this.state.choices}
                onChoose={this.handleCourseChoose.bind(this)}
                maxChoices={this.state.maxChoices}
            />
        });

        return (
            <div className="Page">
                {courses}
            </div>
        );
    }
}

export default CourseSelect;


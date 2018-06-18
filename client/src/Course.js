import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Clear from '@material-ui/icons/Clear';

class Course extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hover: false,
        }
    }

    onChoose(event) {
        this.props.onChoose(this.props.course);
    }

    render() {
        return (
            <Card
                className="Course"
                elevation={this.state.hover ? 8 : 2}
                onMouseEnter={() => this.setState({ hover: true })}
                onMouseLeave={() => this.setState({ hover: false })}
            >
                <CardHeader
                    title={this.props.course.title}
                    subheader={"Periode " + this.props.course.period}
                />
                <CardContent>
                    {this.props.course.description}
                </CardContent>
                <CardActions>
                    {
                        this.getButton(this.props.course,this.props.maxCources,this.props.chosenCourcesCount)
                    }
                </CardActions>
            </Card >
        );
    }

    getButton(course,maxCources,chosenCourcesCount) {
        if (course.chosen) {
            return (
                <Button size="large" color="primary" onClick={this.onChoose.bind(this)}>
                    {course.chosenNum===1?"Eerste keuze":"Tweede keuze"}
                    <Clear />
                </Button>
            );
        } else {
            if (chosenCourcesCount < maxCources) {
                return (
                    <Button variant="contained" size="large" color="primary" onClick={this.onChoose.bind(this)}>
                        {chosenCourcesCount===0?"Eerste keuze":"Tweede keuze"}
                    </Button>
                );
            }            
        }
    }

}

export default Course;


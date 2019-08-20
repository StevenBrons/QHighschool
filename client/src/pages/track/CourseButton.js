import React, { Component } from "react";
import { Button, withStyles, Badge, Tooltip } from '@material-ui/core';

const Orange = "#f68620"; // should be taken from theme
const Red = "#c4122f";

const buttonStyles = {
	root: {
		color: "white",
		borderRadius: "0",
		background: Orange,
		width:"200px",
		height:"80px",
		"&:hover":{
			border: "10px solid " + Orange,
			background: Red,
		},
		"&:disabled": {
			background: "grey",
		}
	},
	textSecondary: {
		background: Red,
		"&:hover":{
			border: "10px solid " + Red,
			background: Orange,
		}
	}
}

const StyledButton = withStyles(buttonStyles)(Button);

const EvaluationCourseStyle = {
	root: {
		background: Red,
		display: "block",
		height:"120px",
		"&:disabled": {
			background: Red,
			color: "white",
		},
	}
}

const EvaluationCourse = withStyles(EvaluationCourseStyle)(StyledButton);

class CourseButton extends Component {

	render() {
		const {selected, evaluation, disabledMessage, courseName, onChange, badgeLabel} = this.props;
		const disabled = disabledMessage !== "";
		if ( evaluation ) {
			let label;
			if (evaluation.type === "check" ) {
				switch (evaluation.assesment) {
					case "passed": label = "Gehaald"; break;
					case "failed": label = "Niet gehaald"; break;
					default: label = "Niet deelgenomen"; break;
				}
			} else if ( evaluation.type === "stepwise") {
				switch (evaluation.assesment) {
					case "O": label = "Onvoldoende"; break;
					case "V": label = "Voldoende"; break;
					case "G": label = "Goed"; break;
					default: label = "Niet deelgenomen"; break;
				}
			} else {
				label = evaluation.assesment;
			}
			return (
				<EvaluationCourse disabled>
					{courseName}
					<h1 style={{margin:"0"}}> {label} </h1>
				</EvaluationCourse>
			)
		}
		return (
			<div class={CourseButton}>
			<Tooltip title={disabledMessage}>
				<Badge color="secondary" badgeContent={badgeLabel} invisible={disabled}>
					<StyledButton 
						onClick ={onChange}
						color={selected ? "secondary" : "primary" }
						disabled={disabled}
					>
						{courseName}
					</StyledButton>
				</Badge>
			</Tooltip>
			</div>
		)
	}
}

export default CourseButton;
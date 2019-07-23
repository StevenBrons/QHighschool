import React, { Component } from "react";
import Page from "./Page";
import { Typography, Toolbar, Paper, Button, withStyles } from '@material-ui/core';
import Field from "../components/Field";
import CheckIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";

const Orange = "#f68620"; // should be taken from theme
const Red = "#c4122f";

const coursesPerPeriod = {
	1: [1,2,3],
	2: [4,5,6,7],
	3: [8,9],
	4: [10,11,12]
}

const PTA = {
	"PO1": [1],
	"PO2": [3],
	"PO3": [4,5],
	"PO4": [6],
	"PO5": [8,9,10,11],
	"PO6": [12],
	"PO7": [8,9,10,11],
}

class Track extends Component {
	constructor(props) {
		super(props);
		this.state = {
			coursesSelected: [],
		}
	}
	trackAccepted = () => {
		return false;
	}

	render() {
		return (
			<Page>
				<Paper elevation={2} style={{ position: "relative" }}>
					<Toolbar style={{ display: "flex" }}>
						<Typography variant="subheading" color="textSecondary" style={{ flex: "2 1 auto" }}>
							Parcours
						</Typography>
						{
							this.trackAccepted() ? <CheckIcon style={{ margin: "20px", color: "green" }} /> : <ErrorIcon style={{ margin: "20px", color: "orange" }} />
						}
					</Toolbar>
				</Paper>
				<CourseButton style={{margin:"15px"}}>
					Object Georienteerd Programmeren
				</CourseButton>
				<CourseButton disabled>
					Object Georienteerd Programmeren
				</CourseButton>
				<CourseButton color="secondary">
					Object Georienteerd Programmeren
				</CourseButton>
			</Page>
		)
	}
}

const buttonStyles = {
	root: {
		color: "white",
		borderRadius: "0",
		background: Orange,

		width: "400px",
		height: "100px",
		"&:hover":{
			border: "10px solid " + Orange,
			background: Red,
		},
		"&:disabled": {
			background: "grey",
			color: "white",
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

const CourseButton = withStyles(buttonStyles)(Button);

export default Track;
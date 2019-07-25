import React, { Component } from "react";
import Page from "./Page";
import { Typography, Toolbar, Paper, Button, withStyles } from '@material-ui/core';
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

				<div style={{overflow:"scroll", display:"flex"}}>
				{[4,5,6].map(y => { return(
				<div style={{marginTop:"15px"}}>
					<div style={{height:"100px", display:"grid"}}>
						<svg viewBox="0 0 950 100" style={{fill:Red, gridArea:"1/1", left:"0"}}>
							<polygon points="0 0 950 0 950 20 0 100"/>
						</svg>
						<Typography variant="h4" style={{color:"white",gridArea:"1/1", margin:"5px"}}>Klas {y}</Typography>
					</div>
					<div style={{
						display: "flex",
					}}>
						{[1,2,3,4].map(p => {
							return (
							<div style = {{ borderLeft: "solid 6pt " + Red, flex:"1 1 auto" }}>
								<div>
									<Typography variant="h6"
												style={{background:Red, color:"white", display:"inline-block"}}>
										Blok {p}
									</Typography>
								</div>
								<CourseButton style={{margin:"15px"}}>
									Object Georienteerd Programmeren
								</CourseButton>
								<CourseButton disabled style={{margin:"15px"}}>
									Object Georienteerd Programmeren
								</CourseButton>
								<CourseButton color="secondary" style={{margin:"15px"}}>
									Object Georienteerd Programmeren
								</CourseButton>
							</div>
							)
						})}
					</div>
				</div>
				)})}
				</div>

			</Page>
		)
	}
}

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
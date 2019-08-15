import React, { Component } from "react";
import Page from "./Page";
import { Typography, Toolbar, Paper, Button, withStyles, Tabs, Tab, Badge } from '@material-ui/core';
import CheckIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import { connect } from 'react-redux';

const Orange = "#f68620"; // should be taken from theme
const Red = "#c4122f";

const courseSchedule = {
	4: {
		1: [1,2,3],
		2: [4,5,6,7],
		3: [8,9],
		4: [10,11,12]
	},
	5: {
		4: [1,2,3],
		3: [4,5,6,7],
		2: [8,9],
		1: [10,11,12]
	},
	6: {
		3: [1,2,3],
		2: [4,5,6,7],
		4: [8,9],
		1: [10,11,12]
	},
}

// const PTA = {
// 	"PO1": [1],
// 	"PO2": [3],
// 	"PO3": [4,5],
// 	"PO4": [6],
// 	"PO5": [8,9,10,11],
// 	"PO6": [12],
// 	"PO7": [8,9,10,11],
// }

const courses = {
	1 : "Object georienteerd programmeren",
	2 : "Filosofie",
	3 : "Meetkunde",
	4 : "Plato en Socrates",
	5 : "Calculus",
	6 : "Imperatief programmeren",
	7 : "Website maken",
	8 : "Engelse literatuur",
	9 : "Nederlandse literatuur",
	10 : "Grafieken",
	11 : "Hardware",
	12 : "HTML: De Basis",
}

class Track extends Component {
	constructor(props) {
		super(props);
		const years = Object.keys(courseSchedule).map(y => parseInt(y,10));
		this.state = {
			coursesSelected: {
				1:null,
				2:null,
				3:null,
				4:null,
			},
			year: years.includes(props.year) ? props.year : years[0],
		}
	}
	trackAccepted = () => {
		return false;
	}

	onChange = (period,course) => {
		let coursesSelected = this.state.coursesSelected;
		if (coursesSelected[period] === course ) {
			coursesSelected[period] = null;
		} else {
			coursesSelected[period] = course;
		}
		this.setState({
			coursesSelected: coursesSelected,
		})
	}

	changeYear = (e,value) => {
		this.setState({
			year:value,
		})
	}

	render() {
		const year = this.state.year;
		const coursesSelected = this.state.coursesSelected;
		const coursesPerPeriod = courseSchedule[year];
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

				<div style={{textAlign:"center"}}>
					<Paper
						style={{display:"inline-block", marginTop:"20px"}}
						>
						<Tabs
							value={year}
							indicatorColor="primary"
							centered
							onChange={this.changeYear}
							>
							<Tab value={4}  label="Klas 4"/>
							<Tab value={5} label="Klas 5"/>
							<Tab value={6} label="Klas 6"/>
						</Tabs>
					</Paper>
				</div>
				<div style={{marginTop:"15px"}}>
					<div style={{height:"30px", background:Red,
				}}>
						<Typography variant="h3" style={{color:"white", margin:"5px", padding:"4px"}}>Klas {year}</Typography>
					</div>
					<div style={{ // triangle
						height:"70px",
						backgroundImage: "linear-gradient(to right bottom, " + Red + " 0%, " + Red + " 50%, transparent 51%)" }} // 51% to avoid pixelated edge
					/>

					<div>
						{[1,2,3,4].map(p => {
							return (
							<div
								key={p}
								style = {{ borderLeft: "solid 6pt " + Red }}
							>
								<div>
									<Typography 
										variant="h6"
										style={{background:Red, color:"white", display:"inline-block", paddingRight:"5px"}}
									>
										Blok {p}
									</Typography>
								</div>
								{coursesPerPeriod[p].map(c => {
									return (
										<span key={c} style={{display:"inline-block", margin:"15px"}}>
											{
											c!==2 ? // TODO replace with if has evaluation
												<Badge color="secondary" badgeContent={c < 8 ? c < 3 ? "Verplicht" : "Keuze" : "Vrij"}>
													<CourseButton 
														onClick ={_ => this.onChange(p,c)}
														color={coursesSelected[p] === c ? "secondary" : "primary" }
													>
														{courses[c]}
													</CourseButton>
												</Badge>
											:
												<CourseButton disabled >
													{courses[c]}
													{
													<h1 style={{margin:"0"}}> 9 </h1>
													}
												</CourseButton>
											}
										</span>
									);
								})}
							</div>
							)
						})}
					</div>
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
			background: Red,
			display: "block",
			color: "white",
			height:"120px",
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

function mapStateToProps(state) {
	const user = state.users[state.userId];
	return {
		year: user.year,
	}
}

export default connect(mapStateToProps,null)(Track);
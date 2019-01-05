import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ChooseButton from './ChooseButton';
import Field from '../../components/Field';
import { Evaluation } from './Evaluation';
import theme from '../../lib/MuiTheme'

const CARD_STYLE = {
	width: "400px",
	height: "338px",
	padding: "15px",
	verticalAlign: "top",
	margin: "12px",
	marginRight: "0px",
	marginBottom: "0px",
	display: "inline-block",
	position: "relative",
}

const CHOOSE_BUTTON_STYLE = {
	position: "absolute",
	bottom: "10px",
	right: "30px",
}

class GroupCard extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hover: false,
			style: CARD_STYLE,
		}
	}

	expand() {
		this.props.history.push("/groep/" + this.props.group.id)
	}

	getBottomSection() {
		const style = {
			position: "absolute",
			bottom: "0px",
			width: "400px",
			height: "55px",
			marginLeft: "-15px",
			borderBottomLeftRadius: "4px",
			borderBottomRightRadius: "4px",
			backgroundColor: theme.palette.primary.light
		};
		if (this.props.group.evaluation) {
			return (
				<div style={style} >
					<Field value="Beoordeling" style={{ type: "headline",color:"primaryContrast" }} />
					<Evaluation evaluation={this.props.group.evaluation} />
				</div>
			);
		} else {
			return (
				<div style={style} >
					{
						this.props.role === "student" &&
						<ChooseButton
							group={this.props.group}
							style={CHOOSE_BUTTON_STYLE}
						/>
					}
					{
						this.props.role !== "student" &&
						<Button
							color="secondary"
							onClick={this.expand.bind(this)}
						>
							Bekijken
						</Button>
					}
				</div >
			);
		}
	}

	render() {
		const group = this.props.group;
		return (
			<Paper
				elevation={this.state.hover ? 4 : 2}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
				style={this.state.style}
			>
				<Typography
					variant="caption"
					color="primary"
					style={{ overflow: "hidden", maxHeight: "65px", cursor: "pointer" }}
					onClick={() => { this.props.history.push("/groep/" + group.id) }}
				>
					{group.subjectName}
				</Typography>
				<Typography
					variant="headline"
					style={{ overflow: "hidden", height: "64px", cursor: "pointer", textTransform: "uppercase", fontSize: "24px" }}
					onClick={() => { this.props.history.push("/groep/" + group.id) }}
				>
					{group.courseName}
				</Typography>
				<div>
					<Typography style={{ display: "inline-block", fontWeight: "bold", float: "right" }}>
						{"Blok " + group.period + " - " + group.day}
					</Typography>
					<Typography style={{ display: "inline-block", fontWeight: "bold" }}>
						{group.enrollableFor || "Iedereen"}
					</Typography>
				</div>
				<Typography style={{ maxHeight: "200px", overflow: "hidden" }} gutterBottom>
					{this.props.group.courseDescription}
				</Typography>
				{
					this.getBottomSection()
				}
			</Paper >
		);
	}


}


export default withRouter(GroupCard);


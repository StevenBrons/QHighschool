import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ChooseButton from './ChooseButton';
import Field from '../../components/Field';
import { Evaluation, getEvaluationColor } from './Evaluation';

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

// const CHOOSE_BUTTON_STYLE = {
// 	position: "absolute",
// 	bottom: "10px",
// 	right: "30px",
// }

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
			display: "flex",
			padding: "5px",
			paddingLeft: "20px",
			paddingRight: "20px",
			justifyContent: "space-between"
		};
		if (this.props.group.evaluation) {
			style.backgroundColor = getEvaluationColor(this.props.group.evaluation);
			return (
				<div style={style} >
					<Field value="Beoordeling" style={{ type: "headline", color: "primaryContrast", flex: 0.8 }} />
					<Evaluation evaluation={this.props.group.evaluation} student />
				</div>
			);
		} else {
			return (
				<div style={style} >
					{
						this.props.role === "student" &&
						<Button
							color="secondary"
							onClick={this.expand.bind(this)}
						>
							Bekijken
						</Button>
					}
					{
						this.props.role === "student" &&
						<ChooseButton
							group={this.props.group}
						/>
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
				{
					group.evaluation ?
						<Typography style={{ maxHeight: "164px", overflow: "hidden" }} gutterBottom>
							<b>Uitleg beoordeling: </b>
							{group.evaluation.explanation}
						</Typography>
						:
						<Typography style={{ maxHeight: "164px", overflow: "hidden" }} gutterBottom>
							{group.courseDescription}
						</Typography>
				}
				{
					this.getBottomSection()
				}
			</Paper >
		);
	}


}


export default withRouter(GroupCard);


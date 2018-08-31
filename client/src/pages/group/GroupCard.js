import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ChooseButton from './ChooseButton';

const CARD_STYLE = {
	width: "400px",
	height: "338px",
	padding: "15px",
	verticalAlign: "top",
	margin: "20px",
	display: "inline-block",
	position: "relative",
}

const CHOOSE_BUTTON_STYLE = {
	position: "absolute",
	bottom: "10px",
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

	render() {
		return (
			<Paper
				elevation={this.state.hover ? 4 : 2}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
				style={this.state.style}
			>
				<Typography
					variant="headline"
					color="primary"
					style={{ overflow: "hidden", maxHeight: "65px", cursor: "pointer", fontSize: this.props.group.courseName.length > 40 ? "16px" : "auto" }}
					onClick={() => { this.props.history.push("/groep/" + this.props.group.id) }}
				>
					{this.props.group.courseName}
				</Typography>
				<div>
					<Typography variant="subheading" color="textSecondary" gutterBottom style={{ display: "inline-block" }}>
						{"Blok " + this.props.group.period + " - " + this.props.group.day}
					</Typography>
					<Typography variant="subheading" color="secondary" gutterBottom style={{ display: "inline-block", marginLeft: "20px" }}>
						{this.props.group.enrollableFor}
					</Typography>
				</div>
				<Typography style={{ maxHeight: "205px", overflow: "hidden" }} gutterBottom>
					{this.props.group.courseDescription}
				</Typography>
				<div style={{ position: "absolute", bottom: "5px" }} >
					{
						this.props.role === "student" ?
							<ChooseButton
								group={this.props.group}
								style={CHOOSE_BUTTON_STYLE}
							/> : null
					}
					{
						this.props.role === "teacher" ?
							<Button
								color="secondary"
								onClick={this.expand.bind(this)}
							>
								Bekijken
						</Button> : null
					}
				</div>
			</Paper >
		);
	}


}


export default withRouter(GroupCard);


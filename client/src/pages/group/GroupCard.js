import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ChooseButton from './ChooseButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import IconButton from '@material-ui/core/IconButton';

const CARD_STYLE = {
	width: "430px",
	height: "210px",
	padding: "15px",
	verticalAlign: "top",
	margin: "20px",
	display: "inline-block",
	cursor: "pointer",
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
				{
					this.state.hover &&
					<IconButton onClick={this.expand.bind(this)} style={{ float: "right" }}>
						<FullscreenIcon />
					</IconButton>
				}
				<Typography variant="headline" color="primary">
					{this.props.group.courseName}
				</Typography>
				<Typography variant="subheading" color="textSecondary" gutterBottom>
					{"Periode " + this.props.group.period + " - " + this.props.group.day}
				</Typography>
				<Typography style={{ height: "45%", overflow: "hidden" }} gutterBottom>
					{this.props.group.courseDescription}
				</Typography>
				{
					this.props.role === "student" ?
						<ChooseButton
							group={this.props.group}
							style={{float:"left"}}
						/> : null
				}
				{
					(this.props.group.foreknowledge != null && this.props.group.foreknowledge.length > 5) ?
						<Typography color="error" style={{ display: "inline-block", width: "60%", marginLeft: "5px" }}>
							{"Verplichte voorkennis: " + this.props.group.foreknowledge}
						</Typography> : null
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
			</Paper >
		);
	}


}


export default withRouter(GroupCard);


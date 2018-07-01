import React, { Component } from 'react';
import {withRouter} from 'react-router';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import IconButton from '@material-ui/core/IconButton';

class GroupCard extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hover: false,
			style: {
				width:"100%",
				height:"45px",
				margin: "0px",
				marginTop: "10px",
				marginBottom: "10px",
				padding: "10px",
				display: "flex",
				justifyContent: "space-between",
			},
		}
	}

	expand() {
		// this.props.history.push("/user/" + this.props.user.id)
	}

	render() {
		return (
			<Paper
				elevation={this.state.hover ? 4 : 2}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
				style={this.state.style}
			>
				<Typography variant="title">
					{this.props.user.firstName + " " + this.props.user.lastName}
				</Typography>
				<Typography variant="subheading">
					{this.props.user.school}
				</Typography>
				<Typography variant="body1">
					{this.props.user.level}
				</Typography>
				<Typography variant="body1">
					{this.props.user.role}
				</Typography>
				<Typography variant="body1">
					{this.props.user.profile}
				</Typography>
				<IconButton onClick={this.expand.bind(this)} style={{ float: "right" ,transform:"translateY(-10px)"}}>
					<UnfoldMoreIcon />
				</IconButton>
			</Paper >
		);
	}


}


export default withRouter(GroupCard);


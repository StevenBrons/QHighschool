import React, { Component } from 'react';
import {withRouter} from 'react-router';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

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
		this.props.history.push("/user/" + this.props.user.id)
	}

	render() {
		const user = this.props.user;
		return (
			<Paper
				elevation={this.state.hover ? 4 : 2}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
				style={this.state.style}
			>
				<Typography variant="title" color={user.role === "teacher"?"secondary":"primary"} style={{flex:1}}>
					{user.firstName + " " + user.lastName}
				</Typography>
				<Typography variant="subheading" style={{flex:1}}>
					{user.school}
				</Typography>
				<Typography variant="body1" style={{flex:1}}>
					{user.level}
				</Typography>
				<Typography variant="body1" style={{flex:1}}>
					{user.role==="teacher"?"docent":"leerling"}
				</Typography>
				<Typography variant="body1" style={{flex:1}}>
					{user.profile}
				</Typography>
				{/* <IconButton onClick={this.expand.bind(this)} style={{ float: "right" ,transform:"translateY(-10px)"}}>
					<FullscreenIcon />
				</IconButton> */}
			</Paper >
		);
	}


}


export default withRouter(GroupCard);


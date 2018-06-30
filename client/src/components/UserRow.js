import React, { Component } from 'react';
import {withRouter} from 'react-router';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ChooseButton from './ChooseButton';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import IconButton from '@material-ui/core/IconButton';

class GroupCard extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hover: false,
			style: {
				width:"100%",
				height:"auto",
			},
		}
	}

	expand() {
		// this.props.history.push("/groep/" + this.props.group.id)
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
						<UnfoldMoreIcon />
					</IconButton>
				}
				<Typography variant="headline" color="primary">
					{this.props.user.firstName + " " + this.props.user.lastName}
				</Typography>
			</Paper >
		);
	}


}


export default withRouter(GroupCard);


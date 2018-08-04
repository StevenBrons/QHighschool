import React, { Component } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import theme from '../lib/MuiTheme'
import Paper from '@material-ui/core/Paper';

class NotificationBar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			visible: true,
		}
	}
	
	close() {
		this.setState({
			visible: false,
		});
	}

	render() {
		if (this.props.notifications.length === 0 || !this.state.visible) {
			return null;
		}
		return (
			<Paper
				elevation={16}
				className="NotificationBar"
			>
				<Toolbar style={{ backgroundColor: theme.palette.error.dark,height:"100%" }}>
						<ErrorIcon style={{color:theme.palette.secondary.contrastText,marginRight:"25px"}}/>
					<Typography variant="title" style={{display:"inline-block",color:theme.palette.error.contrastText}}>
						{this.props.notifications[0].message}
				</Typography>
					<Typography variant="title" style={{display:"inline-block",color:theme.palette.error.contrastText}}>
					</Typography>
					<IconButton color="inherit" aria-label="Menu" onClick={() => this.close()} style={{ right: 25, position: "absolute" }}>
						<CloseIcon style={{color:theme.palette.error.contrastText}}/>
					</IconButton>
				</Toolbar>
			</Paper>
		);
	}
}

function mapStateToProps(state) {
	if (state.userId == null) {
		return {
			notifications: [{
				message: "Bezig met laden..."
			}],
		}
	}
	return {
		notifications: state.users[state.userId].notifications,
	};
}

function mapDispatchToProps(dispatch) {
	return {
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(NotificationBar);




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

	render() {
		let style = {};
		if (this.props.showMenu) {
			style = {
				"grid-column": "3 / span 12",
				"-ms-grid-column": "3",
				"-ms-grid-column-span": "12",
				"grid-row-end": "16",
				"-ms-grid-row": "16",
				"-ms-grid-row-span": "1",
		}
		}else {
			style = {
				"grid-column": "1 / span 15",
				"-ms-grid-column": "1",
				"-ms-grid-column-span": "15",
				"grid-row-end": "16",
				"-ms-grid-row": "16",
				"-ms-grid-row-span": "1",
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




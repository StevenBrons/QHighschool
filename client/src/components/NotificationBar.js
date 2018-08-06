import React, { Component } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';

import theme from '../lib/MuiTheme'
import { removeNotification } from '../store/actions';

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
		
		function checkNotification(not) {
			try {
				return not.type === "bar" && new RegExp(not.scope).test(window.location.pathname);
			} catch (err) {
				return true;
			}
		}

		let notifications = this.props.notifications.filter(checkNotification).map((not) => {
			let bg;
			let fg;
			switch (not.priority) {
				case "low":
				bg = theme.palette.background.paper;
				fg = theme.palette.getContrastText(theme.palette.background.paper);
				break;
				case "medium":
				bg = theme.palette.secondary.light;
				fg = theme.palette.getContrastText(theme.palette.error.light);				
				break;
				case "high":
				default:
					bg = theme.palette.error.dark;
					fg = theme.palette.getContrastText(theme.palette.error.dark);
				break;
			}
			return (
				<Paper
					elevation={16}
				>
					<Toolbar style={{ backgroundColor: bg, height: "100%" }}>
						<ErrorIcon style={{ color: fg, marginRight: "25px" }} />
						<Typography variant="title" style={{ display: "inline-block", color: fg }}>
							{not.message}
						</Typography>
						<Typography variant="title" style={{ display: "inline-block", color: fg }}>
						</Typography>
						<IconButton color="inherit" aria-label="Menu" onClick={() => this.props.removeNotification(not)} style={{ right: 25, position: "absolute" }}>
							<CloseIcon style={{ color: fg }} />
						</IconButton>
					</Toolbar>
				</Paper>
			);
		});
		return (
			<div className="NotificationBar" style={style}>
				{notifications}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		notifications: state.notifications,
		showMenu: state.showMenu,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		removeNotification: (notification) => dispatch(removeNotification(notification)),
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(NotificationBar);




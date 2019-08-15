import React, { Component } from 'react';
import { IconButton, Snackbar, SnackbarContent } from '@material-ui/core/';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { withRouter } from "react-router";

import theme from '../lib/MuiTheme'
import { removeNotification } from '../store/actions';

class NotificationBar extends Component {


	removeNotification = (key) => {
		this.props.removeNotification(this.props.notifications[key]);
	}

	render() {
		let notifications = this.props.notifications.map((not, key) => {
			let color;
			switch (not.priority) {
				case "high":
					color = theme.palette.error.main;
					break;
				case "medium":
					color = "#ff8c00";
					break;
				case "low":
				default:
					color = theme.palette.primary.main;
					break;
			}
			return (
				<Snackbar
					key={key}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right"
					}}
					open={true}
					style={{ position: "relative" }}
					TransitionProps={{ direction: "left" }}
				>
					<SnackbarContent
						style={{ background: color, marginBottom: "4px" }}
						message={<span id="message-id">{not.message}</span>}
						action={not.sticky ? []: [
							<IconButton key="close"
								onClick={() => { this.removeNotification(key) }} >
								<CloseIcon />
							</IconButton>
						]} />
				</Snackbar>
			);
		});
		return (
			<div style={{ position: "fixed", bottom: 0, right: 0, width: "auto", zIndex: 10 }}>
				{notifications}
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	let notifications = state.notifications.filter((not) => {
		try {
			return not.type === "bar" && new RegExp(not.scope).test(ownProps.location.pathname);
		} catch (err) {
			return true;
		}
	});
	return {
		notifications: notifications,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		removeNotification: (notification) => dispatch(removeNotification(notification)),
	};
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NotificationBar));
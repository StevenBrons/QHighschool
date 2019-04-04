import React, { Component } from 'react';
import {IconButton, Snackbar, SnackbarContent} from '@material-ui/core/';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';

import theme from '../lib/MuiTheme'
import { removeNotification } from '../store/actions';

		let testNotifications = [
			{
				priority: "medium",
				type: "bar",
				message: "A message",
				scope:".",
				//scope: "groep\/59\?tab=((Deelnemers)|(Inschrijvingen))"
			},
			{
				priority: "high",
				type:"bar",
				message:"hoi",
				scope: ".",
			},
			{
				priority:"low",
				type:"bar",
				message:" doei",
				scope: ".",
			},
			{
				priority:"low",
				type:"badge",
				message: "dit zou je niet moeten zien",
				scope:".",
			},
			{
				priority:"high",
				type:"bar",
				message: "jajaa",
			},
			{
				priority:"high",
				type:"bar",
				message: "jajadd",
			},
			{
				priority:"high",
				type:"bar",
				message: "jajad",
			},
			{
				priority:"high",
				type:"bar",
				message: "jaja94",
			},
		]

class NotificationBar extends Component {

	constructor(props) {
		super(props);
		let notifications = testNotifications.filter(this.checkNotification).reduce((nots,not,id) => {
			not.open = true;
			nots[id] = not;
			return nots;
		},{}) // map notifications to object with unique keys
		this.state = {
			notifications:notifications,
			nextId:notifications.length,
		}
	}

	checkNotification(not) {
		try {
			return not.type === "bar";// && new RegExp(not.scope).test(window.location.pathname);
		} catch (err) {
			return true;
		}
	}
	closeNotification = (key) => {
		this.setState( prevState => ({
			...prevState,
			notifications:{
				...prevState.notifications,
				[key]:{
					...prevState.notifications[key],
					open:false,
				}
			}
		}))
	}

	removeNotification = (key) => {
		let notifications = this.state.notifications;
		delete notifications[key];
		this.setState(prevState => ({
			...prevState,
			notifications: notifications,
		}));
	}

	render() {
		let notifications = Object.keys(this.state.notifications).map((key,i) => {
			const not = this.state.notifications[key];
			let color;
			switch (not.priority) {
				case "high":
					color = theme.palette.error.main;
					break;
				case "medium":
					color = "#ecef1f";
					break;
				case "light":
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
				open={not.open}
				//autoHideDuration={(i+1) * 3000}
				onExited={() => {this.removeNotification(key)}}
				style = {{marginBottom:i*65 + "px"}}
				TransitionProps={{direction:"left"}}
			  >
			  <SnackbarContent
			  	style={{background:color}}
				message={<span id="message-id">{not.message}</span>}
				action={[
				  <IconButton key="close"
					onClick={() => {this.closeNotification(key)}}
				  >
					<CloseIcon />
				  </IconButton>
				]}
				/>
			  </Snackbar>		
			);
		});
		return (
			<div>
				{notifications}
			</div>
		);
	}
}

// function mapStateToProps(state) {
// 	return {
// 		notifications: state.notifications,
// 	};
// }

// function mapDispatchToProps(dispatch) {
// 	return {
// 		removeNotification: (notification) => dispatch(removeNotification(notification)),
// 	};
// }


//export default connect(mapStateToProps, mapDispatchToProps)(NotificationBar);
export default NotificationBar;
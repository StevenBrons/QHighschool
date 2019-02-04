import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';

import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import theme from '../lib/MuiTheme';

class Menu extends Component {

	constructor(props) {
		super(props);

		this.state = {};
		switch (this.props.role) {
			case "student":
				this.state.pages = ["aanbod", "portfolio", "profiel"];
				break;
			case "teacher":
				this.state.pages = ["groepen", "profiel"];
				break;
			case "admin":
				this.state.pages = ["groepen", "aanbod", "profiel"];
				break;
			default:
				this.state.pages = ["aanbod", "profiel"];
				break;
		}
	}

	onClick(page) {
		if(page === "profiel")
			this.props.history.push("/gebruiker/" + this.props.userId);
		else
			this.props.history.push("/" + page);
	}


	getIcon(iconName, color) {
		let c = "black";
		if (theme.palette[color]) {
			c = theme.palette[color].main;
		}
		switch (iconName) {
			case "Assignment":
				return <AssignmentIcon style={{ color: c }} />;
			case "Group":
				return <GroupIcon style={{ color: c }} />;
			case "Assessment":
				return <AssessmentIcon style={{ color: c }} />;
			case "Person":
				return <PersonIcon style={{ color: c }} />;
			default:
				return null;
		}
	}

	getItem(page, index) {
		const isCurrentPage = ((("/" + page.id) === this.props.location.pathname));
		let style = {};
		if (page.bottom) {
			style.position = "absolute";
			style.bottom = "0px";
		}

		const color = isCurrentPage ? "primary" : "inherit";
		let icon;
		if (page.notifications > 0) {
			icon = (
				<ListItemIcon>
					<Badge badgeContent={this.state.notifications} color="secondary">
						{this.getIcon(page.icon, color)}
					</Badge>
				</ListItemIcon>
			);
		} else {
			icon = (
				<ListItemIcon color={color}>
					{this.getIcon(page.icon, color)}
				</ListItemIcon>
			);
		}
		return (
			<ListItem key={index} button onClick={() => this.onClick(page.id)} style={style}>
				{icon}
				<Typography variant="title" color={color} className="HiddenOnMobile">
					{page.title}
				</Typography>
			</ListItem>
		);
	}

	render() {
		const pages = [
			{
				id: "aanbod",
				title: "Aanbod",
				icon: "Assignment",
			},
			{
				id: "groepen",
				title: "Mijn groepen",
				icon: "Group",
			},
			{
				id: "portfolio",
				title: "Portfolio",
				icon: "Assessment",
			},
		];

		const profile = [
			{
				id: "profiel",
				title: "Profiel",
				icon: "Person",
			},
		];

		const visiblePages = pages
			.filter(page => this.state.pages.indexOf(page.id) !== -1)
			.map(this.getItem.bind(this));

			const visibleProfile = profile
			.filter(page => this.state.pages.indexOf(page.id) !== -1)
			.map(this.getItem.bind(this));

		return (
			<Paper elevation={8} className="Menu">
				<List component="nav" style={{ height: "100%" }}>
					{visiblePages}
					<div style={{position: "absolute", bottom: "20px", width: "100%"}}>
						{visibleProfile}
					</div>
				</List>				
			</Paper >

		);
	}
}

function mapStateToProps(state) {
	if (state.userId != null) {
			return {
				displayName: state.users[state.userId].displayName,
				userId: state.userId,
				role: state.role
			};
			
		}
		return {
			displayName: "",
			userId: state.userId,
			role: state.role
		};
	}


export default withRouter(connect(mapStateToProps)(Menu));


import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIcon from '@material-ui/icons/Assignment';
import GroupIcon from '@material-ui/icons/Group';

import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

class Menu extends Component {

	constructor(props) {
		super(props);

		this.state = {};
		switch (this.props.role) {
			case "student":
				this.state.pages = ["inschrijven"];
				break;
			case "teacher":
				this.state.pages = ["groepen"];
				break;
			case "admin":
				this.state.pages = ["groepen", "inschrijven"];
				break;
			default:
				break;
		}
	}

	onClick(page) {
		this.props.history.push("/" + page);
	}

	getItem(page, index) {
		const isCurrentPage = ((("/" + page.id) === this.props.location.pathname));
		let style = {};
		if (page.bottom) {
			style.position = "absolute";
			style.bottom = "0px";
		}

		let icon;
		if (page.notifications > 0) {
			icon = (
				<ListItemIcon>
					<Badge badgeContent={this.state.notifications} color={"primary"}>
						{page.icon}
					</Badge>
				</ListItemIcon>
			);
		} else {
			icon = (
				<ListItemIcon color={isCurrentPage ? "primary" : "textSecondary"}>
					{page.icon}
				</ListItemIcon>
			);
		}
		return (
			<ListItem key={index} button onClick={() => this.onClick(page.id)} style={style}>
				{icon}
				<Typography variant="subheading" color={isCurrentPage ? "primary" : "textSecondary"}>
					{page.title}
				</Typography>
			</ListItem>
		);
	}

	render() {
		const pages = [
			{
				id: "inschrijven",
				title: "Inschrijven",
				visibleTo: "student",
				icon: <AssignmentIcon />,
			},
			{
				id: "groepen",
				title: "Mijn groepen",
				visibleTo: "teacher",
				icon: <GroupIcon />,
			},
		];

		const visiblePages = pages
			.filter(page => this.state.pages.indexOf(page.id) !== -1)
			.map(this.getItem.bind(this));

		return (
			<Paper elevation={8} className="Menu">
				<List component="nav" style={{ height: "100%" }}>
					{visiblePages}
				</List>
			</Paper >
		);
	}
}

function mapStateToProps(state) {
	return {
		role: state.role
	};
}

export default withRouter(connect(mapStateToProps)(Menu));


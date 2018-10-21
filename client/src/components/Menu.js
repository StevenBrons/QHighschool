import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AssignmentIcon from '@material-ui/icons/Assignment';
import GroupIcon from '@material-ui/icons/Group';

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
				this.state.pages = ["aanbod"];
				break;
			case "teacher":
				this.state.pages = ["groepen"];
				break;
			case "admin":
				this.state.pages = ["groepen", "aanbod"];
				break;
			default:
				this.state.pages = ["aanbod"];
				break;
		}
	}

	onClick(page) {
		this.props.history.push("/" + page);
	}

	getIcon(iconName, color) {
		const c = theme.palette[color].main;
		switch (iconName) {
			case "Assignment":
				return <AssignmentIcon style={{color:c}}/>;
			case "Group":
				return <GroupIcon style={{color:c}}/>;
		}
	}

	getItem(page, index) {
		const isCurrentPage = ((("/" + page.id) === this.props.location.pathname));
		let style = {};
		if (page.bottom) {
			style.position = "absolute";
			style.bottom = "0px";
		}

		const color = isCurrentPage ? "primary" : "disabled";
		let icon;
		if (page.notifications > 0) {
			icon = (
				<ListItemIcon>
					<Badge badgeContent={this.state.notifications} color="primary">
						{this.getIcon(page.icon,color)}
					</Badge>
				</ListItemIcon>
			);
		} else {
			icon = (
				<ListItemIcon color={color}>
					{this.getIcon(page.icon,color)}
				</ListItemIcon>
			);
		}
		return (
			<ListItem key={index} button onClick={() => this.onClick(page.id)} style={style}>
				{icon}
				<Typography variant="title" color={color}>
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
				visibleTo: "student",
				icon: "Assignment",
			},
			{
				id: "groepen",
				title: "Mijn groepen",
				visibleTo: "teacher",
				icon: "Group",
			},
		];

		const visiblePages = pages
			.filter(page => this.state.pages.indexOf(page.id) !== -1)
			.map(this.getItem.bind(this));

		return (
			<Paper elevation={8} className="Menu">
				<List component="nav" style={{ height: "100%" }}>
					{visiblePages}
					<div style={{ margin: "25%", position: "absolute", bottom: "0px" }}>
						<Typography variant="body1" style={{ textTransform: "uppercase" }}>
							Made By
						</Typography>
						<img src="./images/logo_quadraam.svg" alt="Quadraam Logo" style={{ width: "100%" }} />
					</div>
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


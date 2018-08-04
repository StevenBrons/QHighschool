import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SettingsIcon from '@material-ui/icons/Settings';

import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';


class Menu extends Component {

	constructor(props) {
		super(props);

		this.state = {
			pages: [
				{
					id: "inschrijven",
					title: "Inschrijven",
					visibleTo: "student",
					icon: <AssignmentIcon />,
				},
				{
					id: "instellingen",
					title: "Instellingen",
					bottom: true,
					icon: <SettingsIcon />,
				}
			],
		};
	}



	onClick(page) {
		this.props.history.push("/" + page);
	}

	getItem(page, index) {
		// const isCurrentPage = ((("/" + page.id) === this.props.location.pathname));
		let style = {};
		if (page.bottom) {
			style.position = "absolute";
			style.bottom = "0px";
		}

		let icon;
		if (page.notifications > 0) {
			icon = (
				<ListItemIcon>
					<Badge badgeContent={this.state.notifications} color="primary">
						{page.icon}
					</Badge>
				</ListItemIcon>
			);
		} else {
			icon = (
				<ListItemIcon>
					{page.icon}
				</ListItemIcon>
			);
		}
		return (
			<ListItem key={index} button onClick={() => this.onClick(page.id)} style={style}>
				{icon}
				<ListItemText primary={page.title} />
			</ListItem>
		);
	}

	render() {
		var pages = this.state.pages.filter(
			(page) => {
				if (page.visibleTo != null) {
					return page.visibleTo === this.props.role
				}
				return true;
			}
		).map(this.getItem.bind(this));
		return (
			<Paper elevation={8} className="Menu" >
				<List component="nav" style={{ height: "100%" }}>
					{pages}
				</List>
			</Paper >
		);
	}
}

function mapStateToProps(state) {
	return {
		role:state.role
	};
}

export default connect(mapStateToProps)(withRouter(Menu));


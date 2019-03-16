import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, Tooltip, TableSortLabel, Paper } from '@material-ui/core';
import User from "./User";

class UserList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			hover: false,
			style: {
				width: "100%",
				height: "auto",
				margin: "0px",
				padding: "10px",
				backgroundColor: "#e0e0e0",
			},
			sortValue: "",
			sortDirection: "",
		}
	}

	onSortChange = (value) => {
		this.setState({
			sortValue: value,
			sortDirection: this.state.sortDirection === "desc" && this.state.sortValue === value ? "asc" : "desc"
		});
	}

	headerTitle(variant, value, title) {
		let sortValue = this.state.sortValue;
		let sortDirection = this.state.sortDirection === "asc" ? "asc" : "desc";
		return (
			<Typography variant={variant} color={variant === "title" ? "primary" : "default"} style={{ flex: 1 }} >
				<Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
					<TableSortLabel active={sortValue === value}
						direction={sortDirection}
						onClick={() => this.onSortChange(value)}
						style={{ color: "inherit" }} >
						{title}
					</TableSortLabel>
				</Tooltip>
			</Typography>
		)
	}

	getHeader = () => {
		let style = { ...this.state.style };
		return (
			<tr>
				<Paper
					elevation={this.state.hover ? 2 : 1}
					onMouseEnter={() => this.setState({ hover: true })}
					onMouseLeave={() => this.setState({ hover: false })}
					component="td"
					style={style}
				>
					<div style={{
						display: "flex",
						justifyContent: "space-between"
					}}>
						{this.headerTitle("title", "name", "Naam")}
						{this.headerTitle("subheading", "school", "School")}
						{this.headerTitle("body1", "levelAndYear", "Niveau - Leerjaar")}
						{this.headerTitle("body1", "role", "Rol")}
						{this.headerTitle("body1", "profile", "Profiel")}
					</div>
					{this.props.role === "admin" &&
						<div style={{
							display: "flex",
							justifyContent: "space-between"
						}}>
							{this.headerTitle("body1", "email", "Office Email")}
							{this.headerTitle("body1", "preferedEmail", "Voorkeurs email")}
							<div style={{ flex: 1 }} />
							{this.headerTitle("body1", "phoneNumber", "Telefoonnummer")}
							{this.headerTitle("body1", "id", "Gebruikers ID")}
						</div>}
				</Paper >
			</tr>
		)
	}

	sortIds = () => {
		const value = this.state.sortValue;
		const direction = this.state.sortDirection;
		const users = this.props.users;
		const userIds = this.props.userIds;
		if (value === "") {
			return userIds;
		}
		userIds.sort((a, b) => {
			switch (value) {
				case "name":
					a = (users[a]["firstName"] + users[a]["lastName"]).toLowerCase();
					b = (users[b]["firstName"] + users[b]["lastName"]).toLowerCase()
					break;
				case "levelAndYear":
					a = (users[a]["level"] + users[a]["year"]).toString();// to string because otherwise no level and year would result in a being an integer
					b = (users[b]["level"] + users[b]["year"]).toString();
					break;
				default:
					a = users[a][value];
					b = users[b][value];
			}
			let cmp = (b === null || b === undefined) - (a === null || a === undefined) || +(a > b) || -(a < b);
			return direction === "asc" ? cmp : -cmp;
		})
		return userIds;
	}

	render() {
		const header = this.getHeader();
		const users = this.sortIds().map(id => {
			return <User key={id} userId={id} display="row" />
		});
		return (
			<table style={{ width: "100%" }}>
				<tbody>
					{header}
					{users}
				</tbody>
			</table>
		)
	}
}

function mapStateToProps(state, ownProps) {
	return {
		users: state.users,
		role: state.role,
	};
}

export default connect(mapStateToProps)(UserList);
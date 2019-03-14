import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Paper from '@material-ui/core/Paper';
import {Typography, Tooltip, TableSortLabel} from '@material-ui/core';

class GroupCard extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hover: false,
			style: {
				width: "100%",
				height: "auto",
				margin: "0px",
				padding: "10px",
			},
		}
	}

	formatPhoneNumber(number) {
		if (number == null || number === undefined) {
			number = "";
		}
		let numberWithoutCharacters = number.replace(/\D/g, '');
		if (numberWithoutCharacters.length === 10) { // Either 06... or regional i.e. 024 ...
			if (numberWithoutCharacters[1] === "6") { // 06...
				return (numberWithoutCharacters.substr(0, 2) + " " + numberWithoutCharacters.substr(2, 8));
			} else { // 024 ...
				return (numberWithoutCharacters.substr(0, 3) + " " + numberWithoutCharacters.substr(3, 7));
			}
		}
		const mobileTest = /(0031|31)0?(6)?([0-9]+)$/gm;
		const match = mobileTest.exec(numberWithoutCharacters);
		if (match) {
			if (match[2]) { // +31 06 
				return "+31 06 " + match[3];
			} else { // +31 ...
				return "+31 " + match[3];
			}
		} else {
			return number; // return input if unrecognizable 
		}
	}

	expand() {
		this.props.history.push("/user/" + this.props.user.id)
	}

	render() {
		let user = { ...this.props.user };
		let style = { ...this.state.style };
		if (this.props.header) {
			style.backgroundColor = "#e0e0e0";
			let sortValue = this.props.sortValue;
			let sortDirection = this.props.sortDirection === "asc" ? "asc" : "desc";
			console.log(sortDirection);
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
						<Typography variant="title" color="primary" style={{ flex: 1}} >
							<Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                <TableSortLabel active={sortValue === "name"}
                  direction={sortDirection}
                  onClick={() => this.props.onSortChange("name")}
                  style={{color:"inherit"}} >
                  Naam
                </TableSortLabel>
              </Tooltip>
						</Typography>
						<Typography variant="subheading" style={{ flex: 1 }} >
              <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                <TableSortLabel active={sortValue === "school"}
                  direction={sortDirection}
                  onClick={() => this.props.onSortChange("school")} >
                  School 
                </TableSortLabel>
              </Tooltip>
						</Typography>
						<Typography variant="body1" style={{ flex: 1 }} >
              <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                <TableSortLabel active={sortValue === "levelAndYear"}
                  direction={sortDirection}
                  onClick={() => this.props.onSortChange("levelAndYear")} >
                  Niveau - Leerjaar 
                </TableSortLabel>
              </Tooltip>
						</Typography>
						<Typography variant="body1" style={{ flex: 1 }} >
              <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                <TableSortLabel active={sortValue === "role"}
                  direction={sortDirection}
                  onClick={() => this.props.onSortChange("role")} >
                  Rol
                </TableSortLabel>
              </Tooltip>
						</Typography>
						<Typography variant="body1" style={{ flex: 1 }} >
              <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                <TableSortLabel active={sortValue === "profile"}
                  direction={sortDirection}
                  onClick={() => this.props.onSortChange("profile")} >
                  Profiel 
                </TableSortLabel>
              </Tooltip>
						</Typography>
					</div>
					{this.props.role === "admin" &&
						<div style={{
							display: "flex",
							justifyContent: "space-between"
						}}>
							<Typography variant="body1" style={{ flex: 1 }} >
                <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                  <TableSortLabel active={sortValue === "email"}
                    direction={sortDirection}
                    onClick={() => this.props.onSortChange("email")} >
                    Office Email
                  </TableSortLabel>
                </Tooltip>
							</Typography>
							<Typography variant="body1" style={{ flex: 1 }} >
                <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                  <TableSortLabel active={sortValue === "preferedEmail"}
                    direction={sortDirection}
                    onClick={() => this.props.onSortChange("preferedEmail")} >
                    Voorkeurs email 
                  </TableSortLabel>
                </Tooltip>
							</Typography>
							<div style={{ flex: 1 }} />
							<Typography variant="body1" style={{ flex: 1 }} >
                <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                  <TableSortLabel active={sortValue === "phoneNumber"}
                    direction={sortDirection}
                    onClick={() => this.props.onSortChange("phoneNumber")} >
                    Telefoonnummer
                  </TableSortLabel>
                </Tooltip>
							</Typography>
							<Typography variant="body1" style={{ flex: 1 }} >
                <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                  <TableSortLabel active={sortValue === "id"}
                    direction={sortDirection}
                    onClick={() => this.props.onSortChange("id")} >
                    Gebruikers ID
                  </TableSortLabel>
                </Tooltip>
							</Typography>
						</div>
					}
				</Paper >
			</tr>
			)
		}
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
						<Typography variant="title" color={user.role === "teacher" ? "secondary" : "primary"} style={{ flex: 1 }} >
							{user.firstName + " " + user.lastName}
						</Typography>
						<Typography variant="subheading" style={{ flex: 1 }} >
							{user.school}
						</Typography>
						<Typography variant="body1" style={{ flex: 1 }} >
							{user.level + " - " + user.year}
						</Typography>
						<Typography variant="body1" style={{ flex: 1 }} >
							{user.role === "teacher" ? "docent" : "leerling"}
						</Typography>
						<Typography variant="body1" style={{ flex: 1 }} >
							{user.profile}
						</Typography>
					</div>
					{this.props.role === "admin" &&
						<div style={{
							display: "flex",
							justifyContent: "space-between"
						}}>
							<Typography variant="body1" style={{ flex: 1 }} >
								{user.email}
							</Typography>
							<Typography variant="body1" style={{ flex: 1 }} >
								{user.preferedEmail}
							</Typography>
							<div style={{ flex: 1 }} />
							<Typography variant="body1" style={{ flex: 1 }} >
								{this.formatPhoneNumber(user.phoneNumber)}
							</Typography>
							<Typography variant="body1" style={{ flex: 1 }} >
								{user.id}
							</Typography>
						</div>
					}
				</Paper >
			</tr>
		);
	}


}


export default withRouter(GroupCard);


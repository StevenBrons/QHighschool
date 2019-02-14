import React, { Component } from "react";
import Page from "./Page";
import Progress from '../components/Progress';

import { connect } from 'react-redux';
import { Paper, Typography, Table, TableHead, TableCell, TableBody, TableRow } from "@material-ui/core";
import Field from '../components/Field';
import queryString from "query-string";
import Toolbar from '@material-ui/core/Toolbar';

class DataPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			table:"users",
			data: null,
		};
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		let values = queryString.parse(nextProps.location.search);
		return {
			...prevState,
			...{
				table: values.table? values.table :  "evaluations",
			}
		}
	}

	handleFilterChange = event => {
		this.props.history.push({
			search: "table=" + event.target.value,
		});
	};

	render() {
		//<TEMP>
		const dropDownOption = "user_data"; // or "evaluations", or "enrollments"
		//</TEMP>

		let content;
		if (this.state.data == null) {
			content = <Progress/>
			this.props.fetchData(dropDownOption).then(data => this.setState({ data: data }));
		} else {
			content = <Table>
						<TableHead>
							<TableRow>
								{this.state.data[0].map((title) => {
									return(
										<TableCell>{title}</TableCell>
									)
								})}
							</TableRow>
						</TableHead> 
						<TableBody>
							{this.state.data.filter((_,index) => { return(index > 0); } )//take everything but the header
								.map((row, index) => {
									return(
										<TableRow key={index} >
											{row.map((cell) => {
												return(
													<TableCell>{cell}</TableCell>
												)
											})}
										</TableRow>
									)
							})} 
						</TableBody>
					</Table>
		}
		return (
			<Page>
				<Paper elevation = {2} style= {{position: "relative"}}> 
					<Toolbar style={{ display: "flex"}}>
						<Typography variant="subheading" color="textSecondary" style={{ flex: "2 1 auto" }}>
							Gegevens
          				</Typography>
						<Field
							label = "Gegevens van"
							value={this.state.table}
							editable
							options={[
								{ label: "Beoordelingen", value: "evaluations" },
								{ label: "Gebruikers", value: "users" },
								{ label: "Inschrijvingen", value: "enrollments" }]}
							onChange={this.handleFilterChange}
							style = {{flex: "1 1 auto"}}
						/>
					</Toolbar>
				</Paper>
				<br />
				<div>
					<Table>
						{content}
					</Table>
				</div>
			</Page>
		);
	}
}


function mapStateToProps(state) {
	return {
		data: state.data,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchData: async (table) => {
			//feel free to create some better test-data, (to test responsiveness, and, potentialy 12+ columns!)
			switch (table) {
				case "user_data":
					return [
						["displayName", "firstName", "lastName", "role"],
						["B, Steven", "Steven", "B", "admin"],
						["Doe, Jon", "Jon", "Doe", "student"],
						["de Boer, Jorrit", "Jorrit", "de Boer", "admin"],
						["Doe, Jon", "Jon", "Doe", "student"],
						["Musk, Elon", "Elon", "E", "admin"],
						["Jobs, Steve", "Steve", "Jobs", "student"],
						["Gates, Bill", "Bill", "Gates", "grade_admin"],
						["Trump, Donald J", "Donald", "Trump", "student"]
					];
				case "evaluation":
				case "enrollments":
				default:
					return [
						["displayName", "type", "course"],
						["B, Steven", "decimal", "9"],
						["T, Est", "decimal", "6"],
						["B, Steven", "decimal", "9"],
						["T, Est", "decimal", "6"],
						["B, Steven", "decimal", "9"],
						["T, Est", "decimal", "6"],
						["B, Steven", "decimal", "9"],
						["T, Est", "decimal", "6"],
						["B, Steven", "decimal", "9"],
						["T, Est", "decimal", "6"]
					];
			}
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(DataPage);




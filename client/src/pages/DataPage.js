import React, { Component } from "react";
import Page from "./Page";
import Progress from '../components/Progress';

import {withRouter} from 'react-router-dom';
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
		console.log("Table according to this: ", values.table);
		return {
			...prevState,
			...{
				table: values.table? values.table :  "evaluations",
			}
		}
	}

	componentDidMount = () => {
		this.fetchData(this.state.table).then(data => this.setState({ data: data }));
	}
	
	
	handleFilterChange = event => {
		this.props.history.push({
			search: "table=" + event.target.value,
		});
		this.fetchData(this.state.table).then(data => this.setState({ data: data }));
	};

	fetchData = async (table) => {
			//feel free to create some better test-data, (to test responsiveness, and, potentialy 12+ columns!)
			switch (table) {
				case "users":
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
	}

	render() {
		//<TEMP>
		const dropDownOption = "users"; // or "evaluations", or "enrollments"
		//</TEMP>

		let content;
		console.log("Table of: ", this.state.table);
		if (this.state.data == null) {
			content = <Progress/>;
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

export default withRouter(DataPage);
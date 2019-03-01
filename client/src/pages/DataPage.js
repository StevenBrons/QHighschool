import React, { Component } from "react";
import Page from "./Page";
import Progress from '../components/Progress';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Paper, Typography, Table, TableHead, TableCell, TableBody, TableRow, Tooltip, TableSortLabel } from "@material-ui/core";
import Field from '../components/Field';
import queryString from "query-string";
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { setCookie } from '../store/actions';

const splitValues = {
	users: "role",
	evaluations: "subject",
	enrolments: null,
}
class DataPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			tables: null,
			horizontalScroll: 0,
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let values = queryString.parse(nextProps.location.search);
		return {
			...prevState,
			...{
				data: values.data ? values.data : "evaluations",
			}
		}
	}

	componentDidMount = () => {
		this.fetchData(this.state.data, splitValues[this.state.data]).then(tables => this.setState({ tables: tables }));
	}


	handleFilterChange = event => {
		this.props.history.push({
			search: "data=" + event.target.value,
		});
		this.fetchData(event.target.value, splitValues[event.target.value]).then(tables => this.setState({ tables: tables }));
	}

	handleSortChange = (tableIndex,columnIndex) => event => {
		console.log("We're sorting table with index " + tableIndex + " on index column " + columnIndex);
	}

	generateTestTables(rows) {
		const names = ["de Boer, Jorrit", "B, Steven", "Doe, Jon", "Musk, Elon", "Jobs, Steve", "Gates, Bill", "Trump, Donald J"];
		const subjects = ["Introductie Informatica", "Basis van Programmeren", "Keuzemodules", "Databases en SQL", "Programmeren met Python", "Cryptografie"]; 
		let testTables = [["displayName",  "grade", "subject",]];
		for ( let i = 0; i < rows; i ++ ) {
			testTables.push([names[Math.floor(Math.random() * names.length)], (Math.floor(Math.random() * 10)) + 1, subjects[Math.floor(Math.random() * subjects.length)]])
		}
		return testTables;
	}

	splitTable  = (table, splitValue) => {
    let splitIndex = table[0].findIndex(x => x === splitValue);
		if ( splitIndex < 0 ) {
			return [table];
		} else {
			let tables = [[table[0], table[1]]];//initialize the tables with one table that has a header and a row
			for ( let i = 1; i < table.length; i ++ ) {
        let tableIndex = tables.findIndex(halfSplitTable => halfSplitTable[1][splitIndex] === table[i][splitIndex] ); // see in what table this row has to go
				if ( tableIndex < 0 ) {
					tables.push([table[0]]); // add a new table with a new header if a new value is found
					tableIndex = tables.length - 1;
				} 
				tables[tableIndex].push(table[i]); // add row to correct table
			}
			return tables;
		}
	}

	fetchData = async (data, splitValue) => {
    //feel free to create some better test-data, (to test responsiveness, and, potentialy 12+ columns!)
    let tables;
		switch (data) {
			case "users":
        tables = [
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
        break;
			case "evaluations":
				tables = this.generateTestTables(200);
        break
			case "enrollments":
				tables =[
					["Vak", "Leerling", "Datum inschrijving"],
					["Wiskunde D", "Jorrit de Boer", "14-02-2019"],
					["Latijn", "Jorrit", "13-01-2009"]
        ];
        break;
			default:
				tables = [
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
    return this.splitTable(tables, splitValue);
	}

	render() {
		if (this.props.secureLogin == null) {
			return <Page><Paper style={{ padding: "20px" }}>
				<Field value="Log opnieuw in om de gegevens te zien" layout={{ area: true }} />
				<Button color="primary" variant="contained" onClick={() => {
					setCookie("beforeLoginPath", window.location.pathname + window.location.search, 24);
					document.location.href = "/auth/login?secure=true";
				}}>
					Inloggen
				</Button>
			</Paper>
			</Page>
		}
    let content;
		if (this.state.tables == null) {
			content = <Progress />;
		} else {
			content = (this.state.tables).map((table, tableIndex) => {
				return(
					<Table key={tableIndex} style={ tableIndex === 0 ? {  marginTop: "100px" } : {marginTop: "50px"}}>
						<TableHead>
							<TableRow key={0}>
								{table[0].map((title, columnIndex) => {
									return (
											<TableCell key={columnIndex} style={{
												color: "black",
												backgroundColor: "#e0e0e0",
												fontSize: 13,
												top: 0
											}}>
												<Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
													<TableSortLabel active={true} direction="asc" onClick={this.handleSortChange(tableIndex, columnIndex)}>
														{title}
													</TableSortLabel>
												</Tooltip>
											</TableCell>
									)
								})}
							</TableRow>
						</TableHead>
						<TableBody>
							{
								table.filter((_, index) => { return (index > 0); })//take everything but the header
									.map((row, rowIndex) => {
										return (
											<TableRow key={rowIndex + 1}>
												{row.map((cell, columnIndex) => {
													return (
														<TableCell key={columnIndex} >{cell}</TableCell>
													)
												})}
											</TableRow>
										)
									})
							}
						</ TableBody>
					</Table>
				)})
		}
		return (
			<Page >
				<Paper elevation={2} style={{ position: "absolute", width: "80%" }}>
					<Toolbar style={{ display: "flex" }}>
						<Typography variant="subheading" color="textSecondary" style={{ flex: "2 1 auto" }}>
							Gegevens
            </Typography>
						<Field
							label="Gegevens van"
							value={this.state.data}
							editable
							options={[
								{ label: "Beoordelingen", value: "evaluations" },
								{ label: "Gebruikers", value: "users" },
								{ label: "Inschrijvingen", value: "enrollments" }]}
							onChange={this.handleFilterChange}
						/>
					</Toolbar>
				</Paper>
				{content}
			</Page>
		);
	}
}



function mapStateToProps(state, ownProps) {
	return {
		secureLogin: state.secureLogin,
	}
}

export default withRouter(connect(mapStateToProps)(DataPage));
import React, { Component } from "react";
import Page from "./Page";
import Progress from '../components/Progress';

import { withRouter } from 'react-router-dom';
import {
	Paper, Typography, Table, TableHead, TableCell,
	TableBody, TableRow, Tooltip, TableSortLabel, Toolbar, Button
} from "@material-ui/core";
import Field from '../components/Field';
import queryString from "query-string";
import EnsureSecureLogin from "../components/EnsureSecureLogin";
import Excel from "exceljs/dist/es5/exceljs.browser";

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
			tableSortColumns: {},
			tableSortDirections: {},
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
		this.fetchData(this.state.data)
			.then(tables => this.setState({ tables: this.splitTable(tables, splitValues[this.state.data]) }));
	}

	handleFilterChange = event => {
		this.props.history.push({
			search: "data=" + event.target.value,
		});
		this.fetchData(event.target.value)
			.then(tables => this.setState({ tables: this.splitTable(tables, splitValues[this.state.data]), tableSortColumns: Array(tables.length) }));
	}

	sort = (tableIndex) => {
		let table = this.state.tables[tableIndex];
		const column = this.state.tableSortColumns[tableIndex];
		const order = this.state.tableSortDirections[tableIndex];

		table = [table[0]].concat(table.slice(1, table.length).sort((a, b) => {
			//Only sort the slice 1-table.length because the header has to stick
			let cmp = a[column] > b[column] ? 1 : (a[column] < b[column] ? -1 : 0);
			return order === "asc" ? cmp : -cmp;
		}));

		this.setState(prevState => ({
			tables: [
				...prevState.tables.slice(0, tableIndex),
				table,
				...prevState.tables.slice(tableIndex + 1),
			]
		}))
	}

	handleSortChange = (tableIndex, columnIndex) => {
		this.setState(prevState => ({ //update the correct elements of the arrays of the state
			tableSortColumns: {
				...prevState.tableSortColumns,
				[tableIndex]: columnIndex,
			},
			tableSortDirections: {
				...prevState.tableSortDirections,
				[tableIndex]: prevState.tableSortDirections[tableIndex] === 'desc' && prevState.tableSortColumns[tableIndex] === columnIndex ? "asc" : "desc",// if this columns was selected and ordering desc, change to asc else desc
			}
		}), () => this.sort(tableIndex)); // when setting state is done start sorting
	}

	generateTestTables(rows) {
		const names = ["de Boer, Jorrit", "B, Steven", "Doe, Jon", "Musk, Elon", "Jobs, Steve", "Gates, Bill", "Trump, Donald J"];
		const subjects = ["Introductie Informatica", "Basis van Programmeren", "Keuzemodules", "Databases en SQL", "Programmeren met Python", "Cryptografie"];
		let testTables = [["displayName", "grade", "subject",]];
		for (let i = 0; i < rows; i++) {
			testTables.push([names[Math.floor(Math.random() * names.length)], (Math.floor(Math.random() * 10)) + 1, subjects[Math.floor(Math.random() * subjects.length)]])
		}
		return testTables;
	}

	splitTable = (table, splitValue) => {
		let splitIndex = table[0].findIndex(x => x === splitValue);
		if (splitIndex < 0) {
			return [table];
		}
		let tables = [[table[0], table[1]]]; // initialize the tables with one table that has a header and a row
		for (let i = 2; i < table.length; i++) {
			let tableIndex = tables.findIndex(halfSplitTable => halfSplitTable[1][splitIndex] === table[i][splitIndex]); // see in what table this row has to go
			if (tableIndex < 0) {
				tables.push([table[0]]); // add a new table with a new header if a new value is found
				tableIndex = tables.length - 1;
			}
			tables[tableIndex].push(table[i]); // add row to correct table
		}
		return tables;
	}

	fetchData = async (data) => {
		let tables;
		switch (data) {
			case "users":
				tables = [
					["displayName", "firstName", "lastName", "role"],
					["B, Steven", "Steven", "B", "admin"],
					["Doe, Jon", "Jon", "Doe", "student"],
					["de Boer, Jorrit", null, "de Boer", "admin"],
					["Doe, Jon", "Jon", "5", "student"],
					["Musk, Elon", "Elon", "E", "admin"],
					["Jobs, Steve", "Steve", "Jobs", "student"],
					["Gates, Bill", "Bill", "Gates", "grade_admin"],
					["Trump, Donald J", "Donald", "Trump", "student"]
				];
				break;
			case "evaluations":
				tables = this.generateTestTables(50);
				break
			case "enrollments":
				tables = [
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
		return tables;
	}

	downloadTables = () => {
		const tables = this.state.tables;
		let workbook = new Excel.Workbook();
		const splitIndex = tables[0][0].findIndex(x => x === splitValues[this.state.data]);
		for (let i = 0; i < tables.length; i++) { // add all the tables to a different sheet
			let sheet = workbook.addWorksheet(tables[i][1][splitIndex]); // the sheet has the name of the value it's split on. I.e when splitting on courses every page is called what course it contains
			sheet.addRows(tables[i]);
			for (let j = 1; j <= tables[i][0].length; j++) {
				sheet.getColumn(j).width = tables[i][0][j - 1].length < 10 ? 10 : tables[i][0][j - 1].length + 2;//set each column to at least fit the header
			}
		}

		const filenamePrefixes = { users: "Gebruikers ", enrollments: "Inschrijvingen ", evaluations: "Beoordelingen " };
		let filename = filenamePrefixes[this.state.data] + (new Date()).toLocaleDateString() + ".xlsx";
		this.downloadWorkbook(workbook, filename);//gives for example: "Gebruikers 3/3/2019.xlsx"
	}

	downloadWorkbook = (workbook, fileName) => { //magic
		workbook.xlsx.writeBuffer({
			base64: true
		})
			.then(function (xls64) {
				var a = document.createElement("a");
				var data = new Blob([xls64], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
				var url = URL.createObjectURL(data);
				a.href = url;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				setTimeout(function () {
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);
				}, 0);
			})
			.catch(function (error) {
				console.log("Something went wrong with downloading the excel file: " + error.message);
			});
	}

	render() {
		let content;
		if (this.state.tables == null) {
			content = <Progress />;
		} else {
			content = (this.state.tables).map((table, tableIndex) => {
				return (
					<Table key={tableIndex} style={tableIndex === 0 ? { marginTop: "100px" } : { marginTop: "50px" }}>
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
												<TableSortLabel active={this.state.tableSortColumns[tableIndex] === columnIndex}
													direction={this.state.tableSortDirections[tableIndex]}
													onClick={event => this.handleSortChange(tableIndex, columnIndex)}
													style={{ zIndex: 0 }}>
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
								table.filter((_, index) => { return (index > 0); }) //take everything but the header
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
				)
			})
		}
		return (
			<Page >
				<EnsureSecureLogin>
					<Paper elevation={2} style={{ position: "absolute", width: "80%", zIndex: 1 }}>
						<Toolbar style={{ display: "flex" }}>
							<Typography variant="subheading" color="textSecondary" style={{ flex: "2 1 auto" }}>
								Gegevens
							</Typography>
							<Button variant="contained" color="primary" onClick={this.downloadTables} style={{ margin: "0 10px" }}>
								Download
							</Button>
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
				</EnsureSecureLogin>
			</Page>
		);
	}
}

export default withRouter(DataPage);
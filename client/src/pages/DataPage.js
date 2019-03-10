import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	Paper, Typography, Table, TableHead, TableCell,
	TableBody, TableRow, Tooltip, TableSortLabel, Toolbar, Button
} from "@material-ui/core";
import queryString from "query-string";
import Excel from "exceljs/dist/es5/exceljs.browser";

import Page from "./Page";
import Progress from '../components/Progress';
import Field from '../components/Field';
import EnsureSecureLogin from "../components/EnsureSecureLogin";
import $ from "jquery";

const splitValues = {
	users: "role",
	evaluations: "groupId",
	enrolments: "period",
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

	fetchData = (table) => {
		console.log(table);
		return $.ajax({
			url: "api/function/data",
			type: "post",
			data: {
				table,
				secureLogin: this.props.secureLogin,
			},
			dataType: "json",
		});
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

function mapStateToProps(state) {
	return {
		secureLogin: state.secureLogin,
	}
}

export default withRouter(connect(mapStateToProps, null)(DataPage));
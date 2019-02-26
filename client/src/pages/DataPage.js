import React, { Component } from "react";
import Page from "./Page";
import Progress from '../components/Progress';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Paper, Typography, Table, TableHead, TableCell, TableBody, TableRow } from "@material-ui/core";
import Field from '../components/Field';
import queryString from "query-string";
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { setCookie } from '../store/actions';

class DataPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: null,
			horizontalScroll: 0,
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let values = queryString.parse(nextProps.location.search);
		return {
			...prevState,
			...{
				table: values.table ? values.table : "evaluations",
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
		this.fetchData(event.target.value).then(data => this.setState({ data: data }));
	}

	generateTestData(columns, rows) {
		const template = ["Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "Nunc", "congue", "gravida", "ex", "nec", "facilisis", "magna", "Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "Nunc", "congue", "gravida", "ex", "nec", "facilisis", "magna"];
		let testData = [template.splice(0, columns)];
		for (let i = 1; i < rows; i++) {
			testData[i] = testData[0];
		}
		return testData;
	}

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
			case "evaluations":
				return this.generateTestData(15, 50);
			case "enrollments":
				return [
					["Vak", "Leerling", "Datum inschrijving"],
					["Wiskunde D", "Jorrit de Boer", "14-02-2019"],
					["Latijn", "Jorrit", "13-01-2009"]
				];
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
		if (this.state.data == null) {
			content = <Progress />;
		} else {
			content =
				<Table style={{ padding: "20px", marginTop: "100px" }}>
					<TableHead>
						<TableRow key={0}>
							{this.state.data[0].map((title, columnIndex) => {
								return (
									<TableCell key={columnIndex} style={{
										color: "black",
										backgroundColor: "#e0e0e0",
										fontSize: 13,
										top: 0
									}}>
										{title}
									</TableCell>
								)
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{
							this.state.data.filter((_, index) => { return (index > 0); })//take everything but the header
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
							value={this.state.table}
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
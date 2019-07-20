import React, { Component } from 'react';
import Page from './Page';
import Progress from '../components/Progress';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Field from '../components/Field';
import Paper from '@material-ui/core/Paper';
import $ from "jquery";
import queryString from "query-string";

class Taxi extends Component {

	constructor(props) {
		super(props);
		this.state = {
			schedules: null,
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let values = queryString.parse(nextProps.location.search);
		return {
			...prevState,
			...{
				week: values.week ? values.week : "0",
			}
		};
	}

	handleFilterChange = value => {
		this.props.history.push({
			search: "week=" + value,
		});
		this.fetchSchedules(value);
	};


	componentDidMount() {
		this.fetchSchedules(this.state.week);
	}

	fetchSchedules(week) {
		return $.ajax({
			url: "api/function/taxi",
			type: "post",
			data: {
				week,
			},
			dataType: "json",
		}).then(schedules => this.setState({
			schedules,
		}));
	}

	render() {
		let content;
		if (this.state.schedules == null) {
			content = <Progress />
		} else {
			content = this.state.schedules.map((s, i) =>
				<div
					style={{ width: "80%", margin: "auto" }}
					className="taxiScheduleHolder"
					key={i}
					dangerouslySetInnerHTML={{ __html: s }}
				/>
			);
		}
		return (
			<Page>
				<Paper
					elevation={2}
					style={{ position: "relative" }}
				>
					<Toolbar style={{ display: "flex" }}>
						<Typography variant="subtitle1" color="textSecondary" style={{ flex: "2 1 auto" }}>
							Taxischema
          </Typography>
						<Field
							label="week"
							value={this.state.week}
							editable
							options={[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => { return { label: n === 0 ? "Basisrooster" : "Week " + n, value: n + "" } })}
							onChange={this.handleFilterChange}
						/>
					</Toolbar>
				</Paper>
				{content}
			</Page>
		);
	}
}

export default Taxi;



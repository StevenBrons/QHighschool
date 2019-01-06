import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from './Page';
import { getParticipatingGroups } from '../store/actions';
import Group from './group/Group';
import Progress from '../components/Progress';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Field from '../components/Field';
import Paper from '@material-ui/core/Paper';
import queryString from "query-string";

class MyGroups extends Component {

	constructor(props) {
		super(props);
		this.state = {
			filterMethod: "period2",
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let values = queryString.parse(nextProps.location.search);
		return {
			...prevState,
			...{
				filterMethod: values.filter ? values.filter : "period2",
			}
		};
	}

	componentDidMount() {
		this.props.getParticipatingGroups();
	}

	handleFilterChange = event => {
		this.props.history.push({
			search: "filter=" + event.target.value,
		});
	};

	render() {
		let content;
		if (this.props.groups == null) {
			content = <Progress />
		} else {
			content = this.props.groups.filter((group) => {
				if (!group) {
					return false;
				}
				switch (this.state.filterMethod) {
					case "period1":
						return group.period === 1;
					case "period2":
						return group.period === 2;
					case "period3":
						return group.period === 3;
					case "period4":
						return group.period === 4;
					default:
						return true;
				}
			}).map((group) => {
				return <Group
					key={group.id}
					groupId={group.id}
					display="card"
				/>
			});
		}

		return (
			<Page>
				<Paper
					elevation={2}
					style={{ position: "relative" }}
				>
					<Toolbar style={{ display: "flex" }}>
						<Typography variant="subheading" color="textSecondary" style={{ flex: "2 1 auto" }}>
							Mijn groepen
          </Typography>
						<Field
							label="filter"
							value={this.state.filterMethod}
							editable
							options={[
								{ label: "Geen", value: "none" },
								{ label: "Blok 1", value: "period1" },
								{ label: "Blok 2", value: "period2" },
								{ label: "Blok 3", value: "period3" },
								{ label: "Blok 4", value: "period4" }]}
							onChange={this.handleFilterChange}
						/>
					</Toolbar>
				</Paper>
				{content}
			</Page>
		);
	}
}

function mapStateToProps(state) {
	if (state.groups == null || state.users[state.userId].participatingGroupIds == null) {
		return {
			groups: null,
		}
	} else {
		return {
			groups: state.users[state.userId].participatingGroupIds.map((id) => state.groups[id]),
		};
	}

}

function mapDispatchToProps(dispatch) {
	return {
		getParticipatingGroups: () => dispatch(getParticipatingGroups()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MyGroups);



import React from 'react';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import map from 'lodash/map';

import Page from './Page';
import SubjectComponent from '../components/Subject';
import Progress from '../components/Progress';
import Group from './group/Group';
import { getSubjects,getGroups } from '../store/actions';

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

class CourseSelect extends Page {

	constructor(props) {
		super(props);
		this.state = {
			sortMethod: "subject",
		}
	}

	componentDidMount() {
		this.props.getSubjects();
		this.props.getGroups();
	}

	getGroupsPerSubject(subject) {
		return filter(this.props.groups,(group) => {
			return subject.id === group.subjectId;
		})
	}

	handleSortChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		let data;
		switch(this.state.sortMethod) {
			case "subject":
			if (this.props.subjects == null || this.props.groups == null) {
				data = <Progress/>
				break;
			}
			data = map(this.props.subjects,(subject) => {
				return <SubjectComponent
					key={subject.id}
					subject={subject}
					extended={false}
					groups={this.getGroupsPerSubject.bind(this)(subject)}
				/>
			});
			break;
			case "enrollable":
			if (this.props.enrollableGroups == null) {
				data = <Progress/>
				break;
			}
			data = this.props.enrollableGroups.map((group) => {
				return (
					<Group
						key={group.id}
						groupId={group.id}
						display="card"
						/>
				);
			});
			break;
			default:
			break;
		}

		return (
			<Page>
				<AppBar position="static" color="default">
					<Toolbar>
						<Typography variant="subheading" color="textSecondary">
							Meld je aan voor modules
          	</Typography>
						<form autoComplete="off" style={{ right: 10, position: "absolute"}}>
							<FormControl>
								<InputLabel htmlFor="sortMethod">Sorteren op</InputLabel>
								<Select
									value={this.state.sortMethod}
									onChange={this.handleSortChange}
									inputProps={{
										name: 'sortMethod',
										id: 'sortMethod',
									}}
									autoWidth={true}
									size={"large"}
								>
									<MenuItem value="subject">
										<Typography variant="subheading" color="textSecondary" style={{width:"100px"}}>
											Vak
          					</Typography>
									</MenuItem>
									<MenuItem value={"enrollable"} style={{width:"100px"}}>Aanmeldbaar</MenuItem>
								</Select>
							</FormControl>
						</form>
					</Toolbar>
				</AppBar>
				<br />
				{data}
				<br />
				<br />
				<br />
			</Page>
		);
	}
}

function mapStateToProps(state) {
	return {
		enrollableGroups: state.enrollableGroups,
		groups:state.groups,
		subjects:state.subjects,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getSubjects: () => dispatch(getSubjects()),
		getGroups: () => dispatch(getGroups()),
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(CourseSelect);



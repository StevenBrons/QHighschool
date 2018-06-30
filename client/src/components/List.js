import React from 'react';
import { connect } from 'react-redux';

import Page from './Page';
import SubjectComponent from '../components/Subject';
import Progress from '../components/Progress';
import Group from './Group';
import { getSubjects,getGroups } from '../store/actions';
import filter from 'lodash/filter';
import map from 'lodash/map';

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
		return (

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



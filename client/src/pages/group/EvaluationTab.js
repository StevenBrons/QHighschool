import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Progress from '../../components/Progress'
import { connect } from "react-redux";
import { getUser } from "../../store/actions"
import Field from '../../components/Field';

class EvaluationTab extends Component {

	constructor(props) {
		super(props);
		this.state = {
			evaluations: this.props.evaluations,
		}
	}

	handleEvaluationChange(event) {
		let newEvaluations = this.state.evaluations.map((e) => {
			if (e.userId === event.name) {
				return {
					...e,
					assesment: event.target.value,
				}
			} else {
				return { ...e }
			}
		});
		this.setState({
			evaluations: newEvaluations
		});
	}

	handleEvaluationTypeChange(event) {
		let newEvaluations = [];
		for (let i = 0; i < this.state.evaluations.length; i++) {
			newEvaluations.push({
				...this.state.evaluations[i],
				type: event.target.value,
			});
		}
		this.setState({
			evaluations: newEvaluations,
		});
	}

	render() {
		const style = {
			marginTop: "20px",
			display: "flex",
			alignItems: "center",
		};
		const evaluations = this.state.evaluations;
		if (evaluations.length === 0) {
			return "Er zijn nog geen beoordelingen beschikbaar";
		}

		const evComps = evaluations.map(evaluation => {
			if (this.props.users[evaluation.userId] == null) {
				this.props.getUser(evaluation.userId);
				return <Progress />
			}
			return (
				<Paper style={style} key={evaluation.id}>
					<Field style={{ type: "title" }} value={this.props.users[evaluation.userId].displayName} />
					{this.getAssesmentField(evaluation)}
					<Field style={{ type: "headline" }} value={evaluation.type} />
				</Paper >
			);
		});

		return (
			<div>
				<Paper style={style}>
					<div style={{ flex: "5" }} />
					<Field
						label="Beoordelingsformaat"
						style={{ type: "caption", underline: false }}
						value={evaluations[0].type}
						options={["cijfer", "vink"]}
						editable={true}
						onChange={this.handleEvaluationTypeChange.bind(this)}
					/>
				</Paper >
				{evComps}
			</div >
		);
	}

	getAssesmentField(e) {
		switch (e.type) {
			case "vink":
				return (
					<Field
						style={{ type: "headline", underline: false }}
						value={e.assesment ? e.assesment : ""}
						options={["Gehaald", "Niet gehaald"]}
						editable={true}
						name={e.userId}
						onChange={this.handleEvaluationChange.bind(this)}
					/>
				);
			case "cijfer":
			default:
				return (
					<Field
						style={{ type: "headline", underline: false }}
						name={e.userId}
						value={e.assesment ? e.assesment : ""}
						editable={true}
						onChange={this.handleEvaluationChange.bind(this)}
					/>
				);
		}
	}

}
function mapStateToProps(state, ownProps) {
	return {
		evaluations: state.groups[ownProps.groupId].evaluations,
		users: state.users,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getUser: (userId) => dispatch(getUser(userId)),
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(EvaluationTab);
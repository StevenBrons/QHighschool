import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Group from '../components/Group';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

class Subject extends Component {

	constructor(props) {

		super(props);
		this.state = {
			extended: this.props.extended ? true : false,
			canCollapse: true,
			style: {
				height: "auto",
				padding: "20px",
				marginTop: "20px",
				marginBottom: "20px",
				display: "inline-block",
				cursor: "pointer",
			},
		}
	}

	onClick() {
		if (this.state.canCollapse) {
			if (!this.state.extended) {
				document.getElementById("subject_" + this.props.subject.id).scrollIntoView(); 
			}
			this.setState({
				extended: !this.state.extended,
			});
		}
	}

	render() {
		
		const groups = this.props.groups.map((group) => {
			return (
				<Group
					key={group.id}
					groupId={group.id}
					display="Card"
				/>
			);
		});

		return (
			<ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="title" color="primary">{this.props.subject.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
					<div>
						{groups}
					</div>
        </ExpansionPanelDetails>
			</ExpansionPanel>
			
		);
	}
}

export default Subject;


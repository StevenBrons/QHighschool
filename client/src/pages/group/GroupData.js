import React, { Component } from 'react';
import map from 'lodash/map';

import Field from '../../components/Field';
import User from "../user/User"

import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';

class GroupData extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	handleClickAway = () => {
		this.setState({ anchorEl: null });
	}

	showTeacherCard = event => {
		this.setState({ anchorEl: event.currentTarget });
	}

	render() {
		const editable = this.props.editable;
		const role = this.props.role;
		const onChange = this.props.onChange;
		let group = this.props.group;
		return (
			<div style={{ position: "relative" }}>
				<div style={{ display: "flex" }}>
					<Field value={group.courseName} name="courseName" onChange={onChange} editable={editable} style={{ flex: "5", type: "headline" }} validate={{ maxLength: 50 }} />
					<Field value={group.subjectId} name="subjectId" onChange={onChange} layout={{ alignment: "right" }} style={{ type: "headline" }} editable={editable} options={map(this.props.subjects, (subject) => { return { value: subject.id, label: subject.name } })} />
					{
						!editable &&
						<Button color="secondary" style={{ position: "absolute", display: "block", top: "30px", right: "-15px", zIndex: "100" }} onClick={this.showTeacherCard}>
							{group.teacherName}
						</Button>
					}
				</div>
				<div style={{ display: "flex" }} className="ColumnFlexDirectionOnMobile">
					<div style={{ display: "flex", flexDirection: "column" }}>
						<div style={{ flex: 1 }}>
							<Field value={group.period} name="period" editable={editable && role === "admin"} onChange={onChange} style={{ width: "100px", type: "caption" }} options={[{ label: "Blok 1", value: 1 }, { label: "Blok 2", value: 2 }, { label: "Blok 3", value: 3 }, { label: "Blok 4", value: 4 }]} />
							<Field value={group.day} name="day" editable={editable && role === "admin"} onChange={onChange} style={{ width: "150px", type: "caption" }} options={["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"]} />
							<Field value={group.schoolYear} name="schoolYear" editable={editable && role === "admin"} onChange={onChange} options={["2018/2019", "2019/2020", "2020/2021", "2021/2022"]} style={{ width: "120px", type: "caption" }} />
						</div>
						<div>
							<Field value={group.enrollableFor} label="Doelgroep" style={{ width: "100%", labelVisible: true }} name="enrollableFor" default="Iedereen" editable={editable} onChange={onChange} />
						</div>
					</div>
					<div style={{ width: "100%" }}>
						<Field value={group.courseDescription} validate={{ maxLength: 440 }} name="courseDescription" label="Omschrijving" style={{ labelVisible: true }} onChange={onChange} layout={{ area: true }} editable={editable} />
						<Field value={group.foreknowledge} label="Opmerkingen" name="foreknowledge" style={{ width: "80%", labelVisible: true }} default="Geen voorkennis vereist" editable={editable} onChange={onChange} />
						<Field value={group.studyTime} label="Studietijd" name="studyTime" default="onbekend" editable={editable} style={{ labelVisible: true, unit: "uur" }} onChange={onChange} layout={{ alignment: "right" }} validate={{ type: "integer" }} />
					</div>
				</div>
				<br />

				<Popover
					open={this.state.anchorEl ? true : false}
					onClose={this.handleClickAway}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{ horizontal: "left", vertical: "top" }}
				>
					<User key={group.teacherId} userId={group.teacherId} display="card" style={{ margin: "0px" }} />
				</Popover>
			</div>
		);
	}
}

export default GroupData;

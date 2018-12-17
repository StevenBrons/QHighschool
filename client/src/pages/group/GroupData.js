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
					<Field value={group.courseName} maxLength={50} name="courseName" onChange={onChange} headline editable={editable} style={{ flex: "5" }} />
					<Field value={group.subjectId} name="subjectId" onChange={onChange} right headline editable={editable} options={map(this.props.subjects, (subject) => { return { value: subject.id, label: subject.name } })} />
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
							<Field value={group.period} name="period" editable={editable && role === "admin"} onChange={onChange} caption style={{ width: "100px" }} options={[{ label: "Blok 1", value: 1 }, { label: "Blok 2", value: 2 }, { label: "Blok 3", value: 3 }, { label: "Blok 4", value: 4 }]} />
							<Field value={group.day} name="day" editable={editable && role === "admin"} onChange={onChange} caption style={{ width: "150px" }} options={["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"]} />
							<Field value={group.schoolYear} name="schoolYear" editable={editable && role === "admin"} onChange={onChange} caption options={["2018/2019", "2019/2020", "2020/2021", "2021/2022"]} style={{ width: "120px" }} />
						</div>
						<div>
							<Field value={group.enrollableFor} label="Doelgroep" style={{ width: "100%" }} name="enrollableFor" default="Iedereen" editable={editable} labelVisible onChange={onChange} />
						</div>
					</div>
					<div style={{ width: "100%" }}>
						<Field value={group.courseDescription} maxLength={440} name="courseDescription" label="Omschrijving" labelVisible onChange={onChange} area editable={editable} default="Dit aanbod heeft geen omschrijving." rowsMax={10} fullWidth />
						<Field value={group.foreknowledge} label="Vereiste voorkennis" name="foreknowledge" style={{ width: "80%" }} default="Geen voorkennis vereist" editable={editable} labelVisible onChange={onChange} />
						<Field value={group.studyTime} label="Studietijd" name="studyTime" default="onbekend" editable={editable} labelVisible onChange={onChange} right integer unit="uur" />
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

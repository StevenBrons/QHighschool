import React, { Component } from "react";
import map from "lodash/map";

import InputField from "../../fields/InputField";
import SelectField from "../../fields/SelectField";
import User from "../user/User";

import { Divider, Popover } from "@material-ui/core";

class GroupData extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickAway = () => {
    this.setState({ anchorEl: null });
  };

  showTeacherCard = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  render() {
    const editable = this.props.editable;
    const role = this.props.role;
    const onChange = this.props.onChange;
    let group = this.props.group;
    const courseId = "#M" + (this.props.group.courseId + "").padStart(4, "0");

    return (
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex" }}>
          <InputField
            value={group.courseName}
            onChange={value => onChange("courseName", value)}
            editable={editable}
            style={{ flex: "5" }}
            validate={{ maxLength: 50 }}
            typograpyProps={{ variant: "h5", color: "primary" }}
          />
          <SelectField
            value={group.subjectId}
            onChange={value => onChange("subjectId", value)}
            editable={editable}
            typograpyProps={{ variant: "h5", color: "primary" }}
            options={map(this.props.subjects, subject => {
              return { value: subject.id, label: subject.name };
            })}
          />
        </div>
        <div
          style={{ display: "flex" }}
          className="ColumnFlexDirectionOnMobile"
        >
          <div
            style={{
              width: "30%",
              paddingRight: "15px"
            }}
          >
            <div style={{ display: "flex" }}>
              <SelectField
                value={group.period}
                onChange={value => onChange("period", value)}
                editable={editable && role === "admin"}
                style={{ flex: 1 }}
                options={[
                  { label: "Blok 1", value: 1 },
                  { label: "Blok 2", value: 2 },
                  { label: "Blok 3", value: 3 },
                  { label: "Blok 4", value: 4 }
                ]}
              />
              <SelectField
                value={group.day}
                onChange={value => onChange("day", value)}
                editable={editable && role === "admin"}
                style={{ flex: 1 }}
                options={[
                  "onbekend",
                  "maandag",
                  "dinsdag",
                  "woensdag",
                  "donderdag",
                  "vrijdag",
                  "zaterdag",
                  "zondag",
                  "niet van toepassing",
                ]}
              />
              <SelectField
                value={group.schoolYear}
                editable={editable && role === "admin"}
                style={{ flex: 1 }}
                onChange={value => onChange("schoolYear", value)}
                options={this.props.possibleYears}
              />
            </div>
            <Divider style={{ margin: "15px" }} />
            <InputField
              value={group.enrollableFor}
              label="Doelgroep"
              onChange={value => onChange("enrollableFor", value)}
              default="Iedereen"
              editable={editable}
            />
            <InputField
              value={group.studyTime}
              label="Studietijd"
              onChange={value => onChange("studyTime", value)}
              default="onbekend"
              editable={editable}
              unit="uur"
              validate={{ type: "integer" }}
            />
            <InputField
              value={courseId}
              label="Modulecode"
              editable={false}
            />
            <InputField
              value={group.teacherName}
              editable={false}
              label="Hoofddocent"
            />
          </div>
          <div style={{ width: "100%" }}>
            <InputField
              value={group.courseDescription}
              validate={{ maxLength: 440 }}
              label="Omschrijving"
              onChange={value => onChange("courseDescription", value)}
              multiline
              editable={editable}
            />
            <InputField
              value={group.remarks}
              label="Opmerkingen"
              onChange={value => onChange("remarks", value)}
              default="Geen voorkennis vereist"
              multiline
              editable={editable}
            />
          </div>
        </div>
        <br />
        <Popover
          open={this.state.anchorEl ? true : false}
          onClose={this.handleClickAway}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: "left", vertical: "top" }}
        >
          <User
            key={group.teacherId}
            userId={group.teacherId}
            display="card"
            style={{ margin: "0px" }}
          />
        </Popover>
      </div>
    );
  }
}

export default GroupData;

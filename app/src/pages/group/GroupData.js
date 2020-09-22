import React, { Component } from "react";
import map from "lodash/map";

import Field from "../../components/Field";
import User from "../user/User";

import { Divider, Button, Popover } from "@material-ui/core";

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
          <Field
            value={group.courseName}
            onChange={value => onChange("courseName", value)}
            editable={editable}
            style={{ flex: "5", type: "headline" }}
            validate={{ maxLength: 50 }}
          />
          <Field
            value={group.subjectId}
            onChange={value => onChange("subjectId", value)}
            layout={{ alignment: "right" }}
            style={{ type: "headline" }}
            editable={editable}
            options={map(this.props.subjects, subject => {
              return { value: subject.id, label: subject.name };
            })}
          />
          {!editable && (
            <Button
              color="secondary"
              style={{
                position: "absolute",
                display: "block",
                top: "30px",
                right: "-15px",
                zIndex: "100"
              }}
              onClick={this.showTeacherCard}
            >
              <div>{group.teacherName}</div>
            </Button>
          )}
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
            <div>
              <Field
                value={group.period}
                onChange={value => onChange("period", value)}
                editable={editable && role === "admin"}
                style={{ width: "100px", type: "caption" }}
                options={[
                  { label: "Blok 1", value: 1 },
                  { label: "Blok 2", value: 2 },
                  { label: "Blok 3", value: 3 },
                  { label: "Blok 4", value: 4 }
                ]}
              />
              <Field
                value={group.day}
                onChange={value => onChange("day", value)}
                editable={editable && role === "admin"}
                style={{ width: "150px", type: "caption" }}
                options={[
                  "onbekend",
                  "maandag",
                  "dinsdag",
                  "woensdag",
                  "donderdag",
                  "vrijdag",
                  "zaterdag",
                  "zondag"
                ]}
              />
            </div>
            <Field
              value={group.schoolYear}
              editable={editable && role === "admin"}
              onChange={value => onChange("schoolYear", value)}
              options={["2018/2019", "2019/2020", "2020/2021", "2021/2022", "2022/2023", "2023/2024"]}
              style={{ width: "80%", type: "caption" }}
            />
            <Divider style={{ margin: "15px" }} />
            <Field
              value={group.enrollableFor}
              label="Doelgroep"
              onChange={value => onChange("enrollableFor", value)}
              style={{ width: "100%", labelVisible: true, type: "caption" }}
              default="Iedereen"
              editable={editable}
            />
            <Field
              value={group.studyTime}
              label="Studietijd"
              onChange={value => onChange("studyTime", value)}
              default="onbekend"
              editable={editable}
              style={{
                labelVisible: true,
                unit: "uur",
                width: "40%",
                type: "caption"
              }}
              validate={{ type: "integer" }}
            />
            <div style={{ width: "20px", display: "inline-block" }} />
            <Field
              value={courseId}
              label="Modulecode"
              style={{
                labelVisible: true,
                width: "40%",
                type: "caption"
              }}
            />
          </div>
          <div style={{ width: "100%" }}>
            <Field
              value={group.courseDescription}
              validate={{ maxLength: 440 }}
              label="Omschrijving"
              style={{ labelVisible: true }}
              onChange={value => onChange("courseDescription", value)}
              layout={{ area: true }}
              editable={editable}
            />
            <Field
              value={group.remarks}
              label="Opmerkingen"
              onChange={value => onChange("remarks", value)}
              style={{ labelVisible: true }}
              default="Geen voorkennis vereist"
              layout={{ area: true }}
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

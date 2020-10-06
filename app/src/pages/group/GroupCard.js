import { Typography, Button, Paper, Badge } from "@material-ui/core";
import React, { Component } from "react";
import { withRouter } from "react-router";
import ChooseButton from "./ChooseButton";
import { EvaluationDisplay, getEvaluationColor } from "./Evaluation";
import "./GroupCard.css";

class GroupCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false
    };
  }

  expand() {
    this.props.history.push("/groep/" + this.props.group.id);
  }

  getBottomSection(hasEvaluation) {
    if (hasEvaluation) {
      return (
        <div
          className="footer"
          style={{
            backgroundColor: getEvaluationColor(this.props.group.evaluation)
          }}
        >
          <Typography variant="h6" style={{ color: "white" }}>
            Beoordeling
          </Typography>
          <EvaluationDisplay evaluation={this.props.group.evaluation} />
        </div>
      );
    } else {
      return (
        <div className="footer">
          <Button color="secondary" onClick={this.expand.bind(this)}>
            Bekijken
          </Button>
          {this.props.role === "student" && (
            <ChooseButton group={this.props.group} />
          )}
        </div>
      );
    }
  }

  render() {
    const group = this.props.group;
    const hasEvaluation = this.props.group.evaluation &&
      this.props.group.evaluation.assesment !== "" &&
      this.props.group.evaluation.assesment !== null;
    return (
      <div className="GroupCard">
        <Paper
          elevation={this.state.hover ? 4 : 2}
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
        >
          <Badge
            color="secondary"
            invisible={this.props.schoolYear === group.schoolYear}
            badgeContent={group.schoolYear}
          >
            <div className="GroupCardInside">
              <Typography
                variant="caption"
                color="primary"
                style={{
                  overflow: "hidden",
                  maxHeight: "65px",
                  cursor: "pointer"
                }}
                onClick={() => {
                  this.props.history.push("/groep/" + group.id);
                }}
              >
                {group.subjectName +
                  " - #M" +
                  (group.courseId + "").padStart(4, "0")}
              </Typography>
              <Typography
                variant="h1"
                style={{
                  overflow: "hidden",
                  height: "64px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  fontSize: "24px"
                }}
                onClick={() => {
                  this.props.history.push("/groep/" + group.id);
                }}
              >
                {group.courseName}
              </Typography>
              <div>
                <Typography
                  style={{
                    display: "inline-block",
                    fontWeight: "bold",
                    float: "right"
                  }}
                >
                  {"Blok " + group.period + " - " + group.day}
                </Typography>
                <Typography
                  style={{ display: "inline-block", fontWeight: "bold" }}
                >
                  {group.enrollableFor || "Iedereen"}
                </Typography>
              </div>
              {hasEvaluation ? (
                <Typography
                  style={{ maxHeight: "164px", overflow: "hidden" }}
                  gutterBottom
                >
                  <b>Uitleg beoordeling: </b>
                  {group.evaluation.explanation}
                </Typography>
              ) : (
                  <Typography
                    style={{ maxHeight: "164px", overflow: "hidden" }}
                    gutterBottom
                  >
                    {group.courseDescription}
                  </Typography>
                )}
              {this.getBottomSection(hasEvaluation)}
            </div>
          </Badge>
        </Paper>
      </div>
    );
  }
}

export default withRouter(GroupCard);

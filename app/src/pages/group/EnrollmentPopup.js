import React, { Component } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button
} from "@material-ui/core/";
import Clear from "@material-ui/icons/Clear";

class EnrollmentPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, prevProps) {
    return { page: nextProps.hasChosen ? "cancel" : "remarks", ...prevProps };
  }

  getDuplicatePage() {
    return (
      <Dialog open keepMounted>
        <DialogContent>
          <Typography color="error" style={{ fontSize: "16px" }}>
            {"Je hebt al een module gekozen voor " + this.props.group.day + "!"}
          </Typography>
          Je hebt je op deze dag al voor de module&nbsp;
          <Typography color="primary" variant="button">
            {this.props.chosenDayGroupName}
          </Typography>
          &nbsp;ingeschreven. Wil je je ook voor&nbsp;
          <Typography color="primary" variant="button">
            {this.props.group.courseName}
          </Typography>
          &nbsp;inschrijven?
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              this.props.handlePopup(true);
            }}
          >
            Toch inschrijven
          </Button>
          <Button color="default">Annuleren</Button>
        </DialogActions>
      </Dialog>
    );
  }

  getCancelPage() {
    return (
      <Dialog open keepMounted>
        <DialogTitle>Uitschrijven</DialogTitle>
        <DialogContent>
          Weet je zeker dat je wilt uitschrijven voor de module&nbsp;
          <Typography color="primary" variant="button">
            {this.props.group.courseName}
          </Typography>{" "}
          &nbsp;?
        </DialogContent>
        <DialogActions>
          <Button color="default">Annuleren</Button>
          <Button onClick={() => this.props.handlePopup(true)} color="primary">
            Uitschrijven
            <Clear />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  getConfirmPage() {
    return (
      <Dialog open keepMounted>
        <DialogTitle>Inschrijven</DialogTitle>
        <DialogContent>
          Weet je zeker dat je wilt inschrijven voor de module&nbsp;
          <Typography color="primary" variant="button">
            {this.props.group.courseName}
          </Typography>
          &nbsp;?
        </DialogContent>
        <DialogActions>
          <Button color="default">Annuleren</Button>
          <Button
            onClick={() => {
              this.props.handlePopup(true);
            }}
            variant="contained"
            color="primary"
          >
            Inschrijven
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  getRemarkPage = () => {
    const remarks = this.props.group.remarks;
    return (
      <Dialog open keepMounted>
        <DialogTitle>Opmerkingen</DialogTitle>
        <DialogContent>
          <Typography>{remarks}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="default">Annuleren</Button>
          <Button
            onClick={() => {
              this.props.preventPopupClose(true);
              this.setState({ page: "hasChosenDay" });
            }}
            color="primary"
          >
            Verder
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    this.props.preventPopupClose(false);
    const page = this.state.page;

    if (page === "cancel") return this.getCancelPage();
    if (
      page === "remarks" &&
      this.props.group.remarks != null &&
      this.props.group.remarks.length > 1
    ) {
      return this.getRemarkPage();
    }
    if (page === "hasChosenDay" && this.props.hasChosenDay) {
      return this.getDuplicatePage();
    }
    return this.getConfirmPage();
  }
}

export default EnrollmentPopup;

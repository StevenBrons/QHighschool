import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Tooltip,
  TableSortLabel,
  Toolbar,
  Button,
  IconButton
} from "@material-ui/core";
import { VerticalAlignBottom } from "@material-ui/icons";
import queryString from "query-string";
import Excel from "exceljs/dist/es5/exceljs.browser";

import Page from "./Page";
import Progress from "../components/Progress";
import Field from "../components/Field";
import EnsureSecureLogin from "../components/EnsureSecureLogin";
import $ from "jquery";

const splitValues = {
  users: "role",
  evaluations: "groupId",
  enrollments: "period"
};

class DataPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: null,
      tableSortColumns: {},
      tableSortDirections: {},
      data: "enrollments",
      hasFetched: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let values = queryString.parse(nextProps.location.search);
    return {
      ...prevState,
      ...{
        data: values.data ? values.data : "enrollments"
      }
    };
  }

  handleShowData = () => {
    this.setState({
      hasFetched: true
    });
    this.fetchData(this.state.data).then(tables =>
      this.setState({
        tables: this.splitTable(tables, splitValues[this.state.data]),
        tableSortColumns: Array(tables.length)
      })
    );
  };

  handleFilterChange = value => {
    this.props.history.push({
      search: "data=" + value
    });
  };

  sort = tableIndex => {
    let table = this.state.tables[tableIndex];
    const column = this.state.tableSortColumns[tableIndex];
    const order = this.state.tableSortDirections[tableIndex];

    table = [table[0]].concat(
      table.slice(1, table.length).sort((a, b) => {
        //Only sort the slice 1-table.length because the header has to stick
        a = a[column];
        b = b[column];
        const cmp = (b == null) - (a == null) || +(a > b) || -(a < b);
        return order === "asc" ? cmp : -cmp;
      })
    );

    this.setState(prevState => ({
      tables: [
        ...prevState.tables.slice(0, tableIndex),
        table,
        ...prevState.tables.slice(tableIndex + 1)
      ]
    }));
  };

  handleSortChange = (tableIndex, columnIndex) => {
    this.setState(
      prevState => ({
        //update the correct elements of the arrays of the state
        tableSortColumns: {
          ...prevState.tableSortColumns,
          [tableIndex]: columnIndex
        },
        tableSortDirections: {
          ...prevState.tableSortDirections,
          [tableIndex]:
            prevState.tableSortDirections[tableIndex] === "desc" &&
            prevState.tableSortColumns[tableIndex] === columnIndex
              ? "asc"
              : "desc" // if this columns was selected and ordering desc, change to asc else desc
        }
      }),
      () => this.sort(tableIndex)
    ); // when setting state is done start sorting
  };

  splitTable = (table, splitValue) => {
    let splitIndex = table[0].findIndex(x => x === splitValue);
    if (splitIndex < 0) {
      return [table];
    }
    let tables = [[table[0], table[1]]]; // initialize the tables with one table that has a header and a row
    for (let i = 2; i < table.length; i++) {
      let tableIndex = tables.findIndex(
        halfSplitTable => halfSplitTable[1][splitIndex] === table[i][splitIndex]
      ); // see in what table this row has to go
      if (tableIndex < 0) {
        tables.push([table[0]]); // add a new table with a new header if a new value is found
        tableIndex = tables.length - 1;
      }
      tables[tableIndex].push(table[i]); // add row to correct table
    }
    return tables;
  };

  fetchData = table => {
    return $.ajax({
      url: "api/function/data",
      type: "post",
      data: {
        table,
        secureLogin: this.props.secureLogin
      },
      dataType: "json"
    });
  };

  downloadTables = () => {
    const tables = this.state.tables;
    let workbook = new Excel.Workbook();
    const splitIndex = tables[0][0].findIndex(
      x => x === splitValues[this.state.data]
    );
    for (let i = 0; i < tables.length; i++) {
      // add all the tables to a different sheet
      // the sheet has the name of the value it's split on. I.e when splitting on courses every page is called what course it contains
      const sheetName = tables[i][1][splitIndex] + "";
      let sheet = workbook.addWorksheet(sheetName);
      sheet.addRows(tables[i]);
      for (let j = 1; j <= tables[i][0].length; j++) {
        sheet.getColumn(j).width =
          tables[i][0][j - 1].length < 10 ? 10 : tables[i][0][j - 1].length + 2; //set each column to at least fit the header
      }
    }

    const filenamePrefixes = {
      users: "Gebruikers ",
      enrollments: "Inschrijvingen ",
      evaluations: "Beoordelingen ",
      courseIds: "Modulecodes "
    };
    let filename =
      filenamePrefixes[this.state.data] +
      new Date().toLocaleDateString() +
      ".xlsx";
    this.downloadWorkbook(workbook, filename); //gives for example: "Gebruikers 3/3/2019.xlsx"
  };

  downloadWorkbook = (workbook, fileName) => {
    //magic
    workbook.xlsx
      .writeBuffer({
        base64: true
      })
      .then(function(xls64) {
        var a = document.createElement("a");
        var data = new Blob([xls64], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        var url = URL.createObjectURL(data);
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      })
      .catch(function(error) {
        console.log(
          "Something went wrong with downloading the excel file: " +
            error.message
        );
      });
  };

  forceCellWidth = cellName => {
    switch (cellName) {
      case "subject":
        return "200px";
      case "displayName":
        return "200px";
      case "courseName":
        return "300px";
      case "explanation":
        return "200px";
      default:
        return "auto";
    }
  };

  render() {
    let content;
    if (this.state.tables == null) {
      if (this.state.hasFetched) {
        content = <Progress style={{ marginTop: "100px" }} />;
      } else {
        content = (
          <Typography variant="body1">
            Klik op "Laat gegevens" om de gegevens te tonen
          </Typography>
        );
      }
    } else {
      content = this.state.tables.map((table, tableIndex) => {
        return (
          <Table key={tableIndex} style={{ marginTop: "100px" }}>
            <TableHead>
              <TableRow key={0} style={{ height: "auto" }}>
                {table[0].map((title, columnIndex) => {
                  return (
                    <TableCell
                      key={columnIndex}
                      style={{
                        color: "black",
                        backgroundColor: "#e0e0e0",
                        fontSize: 13,
                        top: 0
                      }}
                    >
                      <Tooltip
                        title="Sorteer"
                        enterDelay={300}
                        placement="bottom-start"
                      >
                        <TableSortLabel
                          active={
                            this.state.tableSortColumns[tableIndex] ===
                            columnIndex
                          }
                          direction={this.state.tableSortDirections[tableIndex]}
                          onClick={event =>
                            this.handleSortChange(tableIndex, columnIndex)
                          }
                          style={{ zIndex: 0 }}
                        >
                          <span style={{ width: this.forceCellWidth(title) }}>
                            {title}
                          </span>
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {table
                .filter((_, index) => {
                  return index > 0;
                }) //take everything but the header
                .map((row, rowIndex) => {
                  return (
                    <TableRow key={rowIndex + 1} style={{ height: "auto" }}>
                      {row.map((cell, columnIndex) => {
                        return <TableCell key={columnIndex}>{cell}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        );
      });
    }
    return (
      <Page>
        <EnsureSecureLogin>
          <Paper
            elevation={2}
            style={{
              zIndex: 1,
              position: "absolute",
              width: "85%"
            }}
          >
            <Toolbar style={{ display: "flex" }}>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                style={{ flex: "1 1 auto" }}
              >
                Gegevens
              </Typography>
              <Field
                label="Gegevens van"
                value={this.state.data}
                editable
                options={[
                  { label: "Beoordelingen", value: "evaluations" },
                  { label: "Gebruikers", value: "users" },
                  { label: "Inschrijvingen", value: "enrollments" },
                  { label: "Module codes", value: "courseIds" }
                ]}
                style={{ flex: "0.3" }}
                onChange={this.handleFilterChange}
              />
              <Button
                variant="outlined"
                onClick={this.handleShowData}
                style={{ flex: "0.1 0.1 auto" }}
              >
                Laad gegevens
              </Button>
              <IconButton onClick={this.downloadTables}>
                <VerticalAlignBottom />
              </IconButton>
            </Toolbar>
          </Paper>
          {content}
        </EnsureSecureLogin>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    secureLogin: state.secureLogin
  };
}

export default withRouter(connect(mapStateToProps, null)(DataPage));

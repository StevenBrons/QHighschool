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
import EnsureSecureLogin from "../components/EnsureSecureLogin";
import $ from "jquery";
import SelectField from "../fields/SelectField";

const splitOnDefault = {
  users: "Hoofdrol",
  evaluations: "Groepcode",
  enrollments: "Inschrijfperiode",
  courseIds: "Niet splitsen",
};

class DataPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: null,
      tableSortColumns: {},
      tableSortDirections: {},
      data: "enrollments",
      hasFetched: false,
      splitOn: "Niet splitsen",
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
    const splitOn = splitOnDefault[this.state.data];
    this.fetchData(this.state.data)
      .then(tables =>
        this.setState({
          splitOn,
          tables: this.splitTable(tables, splitOn),
          tableSortColumns: Array(tables.length)
        }));
  };

  handleFilterChange = value => {
    this.props.history.push({
      search: "data=" + value
    });
  };

  handleSplitChange = splitOn => {
    const oldTables = this.state.tables;
    let newTables = [this.state.tables[0][0], ...oldTables
      .map(arr => arr.slice(1, arr.length))
      .flat(1)]

    this.setState({
      splitOn,
      tables: this.splitTable(newTables, splitOn),
    })
  }

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
    const prevState = this.state;
    this.setState({
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
    },
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
    const splitIndex = tables[0][0].findIndex(x => x === this.state.splitOn);
    for (let i = 0; i < tables.length; i++) {
      // add all the tables to a different sheet
      // the sheet has the name of the value it's split on. I.e when splitting on courses every page is called what course it contains
      const sheetName = this.getValidWorksheetName(tables[i][1][splitIndex]);
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
      filenamePrefixes[this.state.data] + "" +
      new Date().toLocaleDateString() +
      ".xlsx";
    this.downloadWorkbook(workbook, filename); //gives for example: "Gebruikers 3/3/2019.xlsx"
  };

  getValidWorksheetName = (name) => { // excel has worksheet naming restrictions
    name = name + "";
    if (name.length > 31) {
      name = name.substring(0, 30);
      console.log('Worksheet name length cannot exceed 31 characters. Name has been shortened.');
    }
    let illegalCharacters = /(\\|\/|\*|\?|:|\[|\])/g
    if (illegalCharacters.test(name)) {
      name = name.replace(illegalCharacters, '_');
      console.log('Worksheet name cannot include one of the following chracters: \\, /, *, ?, :, [, ]. \n Illegal characters have been changed to _ ');
    }
    if (name == null || name === "") {
      name = "_leeg_";
    }
    return name;
  }

  downloadWorkbook = (workbook, fileName) => {
    //magic
    workbook.xlsx
      .writeBuffer({
        base64: true
      })
      .then(function (xls64) {
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
        setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      })
      .catch(function (error) {
        console.log(
          "Something went wrong with downloading the excel file: " +
          error.message
        );
      });
  };

  forceCellWidth = cellName => {
    switch (cellName) {
      case "Vaknaam":
        return "200px";
      case "Weergavenaam":
        return "200px";
      case "Modulenaam":
        return "300px";
      case "Uitleg beoordeling":
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
          <Typography variant="body1" style={{ marginTop: "100px" }}>
            Klik op "Laad gegevens" om de gegevens te tonen
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
                style={{ flex: "6", margin: "5px" }}
              >
                Gegevens
              </Typography>
              <SelectField
                label="Gegevens van"
                value={this.state.data}
                editable
                options={[
                  { label: "Beoordelingen", value: "evaluations" },
                  { label: "Gebruikers", value: "users" },
                  { label: "Inschrijvingen", value: "enrollments" },
                  { label: "Module codes", value: "courseIds" }
                ]}
                style={{ flex: "3", margin: "5px" }}
                onChange={this.handleFilterChange}
              />
              <Button
                variant="outlined"
                onClick={this.handleShowData}
                style={{ flex: "2", margin: "5px" }}
              >
                Laad gegevens
              </Button>
              <SelectField
                value={this.state.splitOn}
                label="Splits op"
                options={this.state.tables ? [...this.state.tables[0][0], "Niet splitsen"] : ["Niet splitsen"]}
                editable={this.state.hasFetched}
                onChange={this.handleSplitChange}
                style={{ flex: "3", margin: "5px" }}
              />
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

import React, { Component } from "react";

function validate(value, rules = {}, options = [value]) {
  switch (rules.type) {
    case "phoneNumber":
      const re = /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/i;
      if (!re.test(value)) {
        return false;
      }
      break;
    case "email":
      const re2 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
      if (!re2.test(value)) {
        return false;
      }
      break;
    case "integer":
      if (!/^\+?[1-9][\d]*$/i.test(value)) {
        return false;
      }
      break;
    case "float":
      if (isNaN(value)) {
        return false;
      }
      break;
    case "decimalGrade":
      //replace dot with comma and vice versa
      if (value == null) {
        return false;
      }
      const x = value
        .replace(/\./g, "_$comma$_")
        .replace(/,/g, ".")
        .replace(/_\$comma\$_/g, ",");
      if (x === "ND") {
        return true;
      }
      if (isNaN(x)) {
        return false;
      }
      break;
    default:
      break;
  }
  if (rules.min) {
    if (parseFloat(value) < rules.min) {
      return false;
    }
  }
  if (rules.max) {
    if (parseFloat(value) > rules.max) {
      return false;
    }
  }
  if (rules.notEmpty) {
    if (
      value == null ||
      value === "" ||
      value === " " ||
      options.indexOf(value) === -1
    ) {
      return false;
    }
  }
  if (rules.maxLength && value != null) {
    if (value.length > rules.maxLength) {
      return false;
    }
  }

  return true;
}

class FieldContainer extends Component {

  render() {
    const component = this.props.children;
    const style = { flex: "1", ...this.props.style }

    if (this.props.td) {
      return <td style={style}>
        {component}
      </td>
    } else {
      return <div style={style}>
        {component}
      </div>
    }
  }
}

export { validate };
export default FieldContainer;

import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import theme from '../lib/MuiTheme'
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import PropTypes from 'prop-types';

class Field extends Component {

	constructor(props) {
		super(props);
		this.state = {
			error: false,
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			...prevState,
			error: nextProps.editable ? !Field.validate(nextProps.value, nextProps.validate) : false,
		}
	}

	static validate(value, rules = {}, options = [value]) {
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
				const x = value.replace(/\./g, "_$comma$_").replace(/,/g, ".").replace(/_\$comma\$_/g, ",");
				if (x === "ND") {
					return true;
				}
				if (isNaN(x)) {
					return false;
				}
				break;
			default: break;
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
			if (value == null || value === "" || value === " " || options.indexOf(value) === -1) {
				return false;
			}
		}
		if (rules.maxLength) {
			if (value.length > rules.maxLength) {
				return false;
			}
		}

		return true;
	}

	onChange(event) {
		this.props.onChange({
			...event,
			name: this.props.name,
		});
	}

	render() {
		let value = this.props.value == null ? "" : this.props.value;
		let style = this.props.style || {};
		let layout = this.props.layout || {};

		let label = this.props.label;
		let disabled = true;
		let multiline = false;
		let fullWidth = false;

		let options = this.props.options;
		let disableUnderline = style.underline || true;
		let margin = style.margin || "none";
		let menuItems;
		let endAdornment;
		let classNames = [];

		if (this.props.style) {
			switch (this.props.style.type) {
				case "headline":
					style = {
						...style,
						...theme.typography.headline,
					};
					style.color = theme.palette.primary.main;
					break;
				case "title":
					style = {
						...style,
						...theme.typography.title
					};
					style.color = theme.palette.primary.main;
					break;
				case "caption":
					style.color = theme.palette.text.secondary;
					break;
				default:
					style.color = theme.palette.text.primary;
					break;
			}
			switch (this.props.style.color) {
				case "primary":
					style.color = theme.palette.primary.main;
					break;
				case "primaryContrast":
					style.color = theme.palette.primary.contrastText;
					break;
				case "secondary":
					style.color = theme.palette.secondary.main;
					break;
				case "error":
					style.color = theme.palette.error.main;
					break;
				default:
					break;
			}
		}

		if (layout.alignment === "right") {
			style.float = "right";
			style.textAlign = "right";
			classNames.push("right");
		}
		if (layout.alignment === "left") {
			style.float = "left";
		}

		if (layout.area) {
			fullWidth = true;
			multiline = true;
		}

		if (this.props.default && this.props.editable === false && (value === "" || value == null)) {
			value = this.props.default;
		}

		if (this.props.editable) {
			disabled = false;
			disableUnderline = style.underline || false;
			margin = style.margin || "normal";
		} else {
			if (!(style.labelVisible === true)) {
				label = null;
			}
			if (options != null && options[0] != null && typeof options[0] !== "string") {
				const a = options.filter((opt) => {
					return opt.value === value;
				})[0];
				if (a != null) {
					value = a.label;
				}
			}
			options = null;
		}

		if (options) {
			menuItems = options.map(option => {
				if (typeof option !== "string") {
					return (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					)
				}
				return (
					<MenuItem key={option} value={option}>
						{option}
					</MenuItem>
				)
			});
		}
		if (style.unit) {
			endAdornment = <InputAdornment position="end">{style.unit}</InputAdornment>;
		}
		if (layout.td) {
			style.width = "100%";
		}

		const field = (
			<TextField
				value={value}
				margin={margin}
				disabled={disabled}
				fullWidth={fullWidth}
				multiline={multiline}
				className={classNames.join(" ")}
				label={label}
				select={options ? true : false}
				style={{ flex: 1, ...style }}
				onChange={this.onChange.bind(this)}
				error={this.state.error}
				InputProps={{
					disableUnderline,
					style,
					endAdornment: endAdornment ? endAdornment : null,
					inputProps: {
						style
					}
				}}

			>
				{menuItems}
			</TextField>
		);
		if (layout.td) {
			style.width = undefined;
			return (
				<td style={style}>
					{field}
				</td>
			);
		} else {
			return field;
		}
	}

}


Field.propTypes = {
	validate: PropTypes.shape({
		min: PropTypes.integer,
		max: PropTypes.integer,
		type: PropTypes.oneOf("phoneNumber", "email", "integer"),
		notEmpty: PropTypes.bool,
		maxLength: PropTypes.integer,
	}),
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.integer,
	]),
	style: PropTypes.shape({
		labelVisible: PropTypes.bool,
		type: PropTypes.oneOf([
			"title",
			"caption",
			"headline",
		]),
		underline: PropTypes.bool,
		color: PropTypes.oneOf("primary", "secondary", "error"),
		unit: PropTypes.string,
		margin: PropTypes.oneOf("none", "dense", "normal"),
	}),
	layout: PropTypes.shape({
		area: PropTypes.bool,
		alignment: PropTypes.oneOf("left", "right"),
		td: PropTypes.bool,
	}),
	label: PropTypes.string,
	options: PropTypes.arrayOf(
		PropTypes.oneOf(
			PropTypes.shape({
				value: PropTypes.string,
				label: PropTypes.string,
			}),
			PropTypes.string
		)),
	editable: PropTypes.bool,
	default: PropTypes.string,
};

export default Field;
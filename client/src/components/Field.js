import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import theme from '../lib/MuiTheme'
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';

class Field extends Component {

	constructor(props) {
		super(props);
		this.state = {
			error: false,
		}
	}

	componentDidMount() {
		this.checkRequirements(this.props.value);
	}

	checkRequirements(value) {
		let error = false;
		if (this.props.email) {
			const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
			if (!re.test(value)) {
				error = true;
			}
		}
		if (this.props.integer) {
			const re = /^\+?[1-9][\d]*$/i;
			if (!re.test(value)) {
				error = true;
			}
		}
		if (this.props.min) {
			if (parseInt(value, 10) < this.props.min) {
				error = true;
			}
		}
		if (this.props.max) {
			if (parseInt(value, 10) > this.props.max) {
				error = true;
			}
		}
		if (this.props.phoneNumber) {
			const re = /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/i;
			if (!re.test(value)) {
				error = true;
			}
		}
		if (this.props.notEmpty) {
			if (value == null || value === "" || value === " " || (this.props.options != null && this.props.options.indexOf(value) === -1)) {
				error = true;
			}
		}

		this.setState({
			error,
		});
	}

	onChange(event) {
		this.checkRequirements(event.target.value);
		this.props.onChange({
			...event,
			name: this.props.name,
		});
	}

	render() {
		let value = this.props.value == null ? "" : this.props.value;
		let textAlign = this.props.right ? "right" : "left";
		let float = this.props.right ? "right" : "none";
		let color = theme.palette.text.primary;
		let fontSize = "1em";
		let fontWeight = "normal";
		let fullWidth = false;
		let style = this.props.style;
		let disabled = true;
		let options = this.props.options;
		let disableUnderline = this.props.disableUnderline || true;
		let margin = this.props.margin || "none";
		let multiline = false;
		let menuItems;
		let label = this.props.label;
		if (style == null) {
			style = {};
		}
		if (this.props.headline) {
			color = theme.palette.primary.main;
			fontSize = "1.5em"
		}
		if (this.props.caption) {
			color = theme.palette.text.secondary;
		}
		if (this.props.area) {
			fullWidth = true;
			multiline = true;
		}
		if (this.props.editable) {
			disabled = false;
			disableUnderline = this.props.disableUnderline || false;
			margin = this.props.margin || "normal";
		} else {
			if (!this.props.labelVisible) {
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
		if (this.props.title) {
			color = theme.palette.primary.main;
			style.lineHeight = "1.16667em";
			fontSize = "1.3125rem";
			fontWeight = "500";
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
		const field = (
			<TextField
				value={value}
				margin={margin}
				disabled={disabled}
				fullWidth={fullWidth}
				multiline={multiline}
				className={this.props.right ? "right" : ""}
				label={label}
				select={options ? true : false}
				style={{ ...{ float, flex: 1 }, ...style }}
				onChange={this.onChange.bind(this)}
				error={this.state.error}
				InputProps={{
					disableUnderline,
					style: {
						...style,
						fontSize,
						color,
						textAlign,
						float,
						fontWeight,
					},
					inputProps: {
						style: {
							...style,
							textAlign,
						}
					}
				}}

			>
				{menuItems}
			</TextField>
		);
		if (this.props.td) {
			return (
				<td>
					{field}
				</td>
			);
		}else {
			return field;
		}
	}

}


Field.propTypes = { 
  firstName:PropTypes.string.isRequired, 
  lastName:PropTypes.string.isRequired, 
  country:PropTypes.string 
}; 

export default Field;
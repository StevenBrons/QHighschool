import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import theme from '../lib/MuiTheme'
import MenuItem from '@material-ui/core/MenuItem';

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
		if (this.props.email){
			const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
			if (!re.test(value)) {
				error = true;
			}
		}
		if (this.props.integer){
			const re = /^\+?[1-9][\d]*$/i;
			if (!re.test(value)) {
				error = true;
			}
		}
		if (this.props.min){
			if (parseInt(value,10) < this.props.min) {
				error = true;
			}
		}
		if (this.props.max){
			if (parseInt(value,10) > this.props.max) {
				error = true;
			}
		}
		if (this.props.phoneNumber){
			const re = /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/i;
			if (!re.test(value)) {
				error = true;
			}
		}
		if (this.props.notEmpty){
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
			name:this.props.name,
		});
	}

	render() {
		let value = this.props.value == null?"":this.props.value;
		let textAlign = this.props.right ? "right" : "left";
		let float = this.props.right ? "right" : "none";
		let color = theme.palette.text.primary;
		let fontSize = "1em";
		let fontWeight = "normal";
		let fullWidth = false;
		let style = this.props.style;
		let disabled = true;
		let disableUnderline = this.props.disableUnderline||true;
		let margin = this.props.margin||"none";
		let multiline = false;
		let menuItems;
		if (this.props.options) {
			menuItems = this.props.options.map(option => {
				return (
					<MenuItem key={option} value={option}>
						{option}
					</MenuItem>
				)
			});
		}
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
			disableUnderline = this.props.disableUnderline||false;
			margin = this.props.margin||"normal";
		}
		if (this.props.title) {
			color = theme.palette.primary.main;
			style.lineHeight = "1.16667em";
			fontSize = "1.3125rem";
			fontWeight = "500";
		}

		return (
			<TextField
				value={value}
				margin={margin}
				disabled={disabled}
				fullWidth={fullWidth}
				multiline={multiline}
				className={this.props.right?"right":""}
				label={this.props.label}
				select={this.props.options ? true : false}
				style={{ float, flex: 1, marginLeft: "10px", marginRight: "10px" }}
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
	}

}

export default Field;
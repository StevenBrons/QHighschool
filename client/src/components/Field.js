import React, { Component } from 'react';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import theme from '../MuiTheme'

import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { createMuiTheme } from '@material-ui/core';

class Field extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		let textAlign = this.props.right ? "right" : "left";
		let float = this.props.right ? "right" : "none";
		let color = theme.palette.text.primary;
		let fontSize = "1em";
		let fullWidth = false;
		let style = this.props.style;
		let disabled = true;
		let disableUnderline = true;
		let margin = "none";
		let multiline = false;
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
			disableUnderline = false;
			margin = "normal";
		}

		return (
			<TextField
				value={this.props.value}
				margin={margin}
				disabled={disabled}
				fullWidth={fullWidth}
				multiline={multiline}
				style={{ float }}
				InputProps={{
					disableUnderline,
					style: {
						...this.props.style, 
						...{
							fontSize,
							color,
							textAlign,
							float,
						}
					}
				}}
				inputProps={{
					style: {
						textAlign,
					}
				}}
			/>
		);
	}

}

export default Field;
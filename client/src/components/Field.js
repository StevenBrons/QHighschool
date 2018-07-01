import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import theme from '../lib/MuiTheme'

class Field extends Component {

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
					},
					inputProps:{
						style: {
							textAlign,
						}
					}
				}}
				
			/>
		);
	}

}

export default Field;
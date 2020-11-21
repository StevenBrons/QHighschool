import { InputAdornment, TextField, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import FieldContainer, { validate } from './FieldContainer';

class InputField extends Component {

	render() {
		const P = this.props;
		let value = P.value;
		if ((value == null || value === "") && P.default) {
			value = P.default;
		}
		let CP = {
			InputProps: {},
			InputLabelProps: {},
			inputProps: {},
		}

		CP.error = (P.editable !== false && !P.disabled) ? !validate(value, P.validate) : false;
		CP.disabled = P.disabled;
		CP.value = value;
		CP.label = P.label;
		CP.variant = P.variant;
		CP.multiline = P.multiline;
		CP.fullWidth = true;
		CP.defaultValue = P.defaultValue;
		CP.onChange = (event) => this.props.onChange(event.target.value)
		CP.InputProps.disableUnderline = P.editable === false;
		CP.InputLabelProps.disabled = true;

		if (P.unit) CP.InputProps.endAdornment = <InputAdornment position="end">{P.unit}</InputAdornment>;
		if (P.editable === false) CP.inputProps.readOnly = "readonly";

		let component;
		if (this.props.editable === false && this.props.typograpyProps) {
			component =
				<Typography {...this.props.typograpyProps}>
					{this.props.value}
				</Typography>
		} else {
			component = <TextField {...CP} />
		}

		return <FieldContainer {...P}>
			{component}
		</FieldContainer>
	}

}


export default InputField;
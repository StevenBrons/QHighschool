import { InputAdornment, TextField } from '@material-ui/core';
import React, { Component } from 'react';
import FieldContainer, { validate } from './FieldContainer';

class InputField extends Component {

	render() {
		const P = this.props;
		let value = P.value;
		if (value == null || value === "") {
			value = P.default;
		}
		let CP = {
			InputProps: {}
		} // Component props
		CP.error = P.editable ? !validate(value, P.validate) : false;
		CP.disabled = !P.editable;
		CP.value = value;
		CP.label = P.label;
		CP.multiline = P.multiline;
		CP.defaultValue = P.defaultValue;
		if (P.unit) {
			CP.InputProps.endAdornment = <InputAdornment position="end">{P.unit}</InputAdornment>;
		}

		return <FieldContainer {...P}>
			<TextField
				{...CP}
				fullWidth
				onChange={(event) => this.props.onChange(event.target.value)}
			>
			</TextField>
		</FieldContainer>
	}

}


export default InputField;
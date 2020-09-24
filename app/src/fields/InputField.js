import { TextField } from '@material-ui/core';
import React, { Component } from 'react';
import FieldContainer, { validate } from './FieldContainer';

class InputField extends Component {

	render() {
		const P = this.props;
		let CP = {} // Component props
		CP.error = P.editable ? !validate(P.value, P.validate): false;
		CP.disabled = !P.editable;
		CP.label = P.label;

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
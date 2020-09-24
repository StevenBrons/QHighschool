import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { Component } from 'react';
import FieldContainer from './FieldContainer';

class SelectField extends Component {

	constructor(props) {
		super(props);
		this.state = {}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
    return {
			...prevState,
			options: SelectField.getNormalizedOptions(nextProps.options)
    };
  }

  static getNormalizedOptions = (options) => {
		if (options.length > 0 && options[0].value == null) {
			options = options.map((value) => {
				return {
					label: value,
					value: value,
				}
			})
		}
    return options;
  }

  getOptionLabel = (v) => {
    const opt = this.state.options.filter(({value}) => value === v)
    if (opt.length > 0) {
      return opt[0].label;
    } else {
      return "";
    }
  }

	getAutocomplete = () => {
		return <Autocomplete
			value={this.props.value}
			options={this.state.options.map(({label,value}) => value)}
			getOptionLabel={this.getOptionLabel}
			onChange={(event,value) => this.props.onChange(value)}
			renderInput={(params) => <TextField {...params} label={this.props.label}  variant="outlined" />}
		/>
	}

	getDropdown = () => {
		return <FormControl fullWidth>
		{this.props.label && <InputLabel>{this.props.label}</InputLabel>}
			<Select
				multiple={this.props.multiple}
				fullWidth
				value={this.props.value}
				onChange={(event) => this.props.onChange(event.target.value)}
				renderValue={
					this.props.multiple ? 
						((vs) => vs.map(this.getOptionLabel).join(", ")) : 
						this.getOptionLabel
				}
			>
				{this.state.options.map(({label,value}) => (
					<MenuItem key={value} value={value}>
						{label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	}

	render() {
		let field;
		if (this.state.options.length > 10 && !this.props.multiple) {
			field = this.getAutocomplete();
		} else {
			field = this.getDropdown();
		}

		return <FieldContainer {...this.props} >
			{field}
		</FieldContainer>
	}

}

export default SelectField;
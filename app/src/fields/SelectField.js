import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
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

	getOptionsLabel = (v3) => {
		let vs = this.props.multiple ? v3 : [v3];
		return vs.map((v) => {
			const opt = this.state.options.filter(({ value }) => value === v)
			if (opt.length > 0) {
				return opt[0].label;
			} else {
				return "";
			}
		}).join(", ");
	}

	getAutocomplete = () => {
		if (this.props.editable === false) {
			return <Typography {...this.props.typograpyProps}>
				{this.getOptionsLabel(this.props.value)}
			</Typography>
		} else {
			return <Autocomplete
				value={this.props.value}
				disabled={this.props.disabled}
				options={this.state.options.map(({ label, value }) => value)}
				getOptionLabel={this.getOptionsLabel}
				onChange={(event, value) => this.props.onChange(value)}
				renderInput={(params) => <TextField {...params} label={this.props.label} variant="outlined" />}
				disableUnderline
			/>
		}
	}

	getCurtain = () => {
		return <div style={{ width: "100%", height: "100%", position: "absolute", zIndex: 10 }} />
	}

	getDropdown = () => {
		let nonEdit = {}
		if (this.props.editable === false) {
			nonEdit.disableUnderline = true;
			nonEdit.IconComponent = "div";
		}
		return <FormControl fullWidth>
			{this.props.label && <InputLabel>{this.props.label}</InputLabel>}
			{this.props.editable === false && this.getCurtain()}
			<Select
				multiple={this.props.multiple}
				fullWidth
				disabled={this.props.disabled}
				value={this.props.value}
				onChange={(event) => this.props.onChange(event.target.value)}
				{...nonEdit}
				renderValue={(vs) => <Typography {...this.props.typograpyProps}>{this.getOptionsLabel(vs)}</Typography>}
			>
				{this.state.options.map(({ label, value }) => (
					<MenuItem key={value} value={value}>
						{label}
					</MenuItem>
				))}
			</Select>
		</FormControl >
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
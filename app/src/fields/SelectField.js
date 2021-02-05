import { FormControl, InputLabel, ListSubheader, MenuItem, Select, TextField, Typography } from '@material-ui/core';
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

	getOptionsLabel = (val) => {
		let vs = this.props.multiple ? val : [val];
		return vs.map((v) => {
			const opt = this.state.options.filter(({ value }) => value === v)
			if (opt.length > 0) {
				if (opt[0].category) {
					return <div>
						<Typography {...this.props.typograpyProps} variant="subtitle2">{opt[0].category}</Typography>
						<Typography {...this.props.typograpyProps}>{opt[0].label}</Typography>
					</div>
				} else {
					return opt[0].label;
				}
			} else {
				return "";
			}
		});
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
			/>
		}
	}

	getCurtain = () => {
		return <div style={{ width: "100%", height: "100%", position: "absolute", zIndex: 10 }} />
	}

	renderMenuItems = () => {
		if (this.props.children == null) {
			const items = this.state.options.reduce((acc, cur) => {
				const last = acc[acc.length - 1];
				if ((cur.category != null && last == null) || (last != null && last.category !== cur.category)) {
					return acc.concat([{ sep: true, category: cur.category }, cur])
				}
				return acc.concat([cur]);
			}, [])
			return items.map(({ sep, label, value, category }) => {
				if (sep) {
					return <ListSubheader>{category}</ListSubheader>;
				} else {
					return <MenuItem key={value} value={value}>
						{label}
					</MenuItem>
				}
			});
		} else {
			return this.props.children;
		}
	}

	getDropdown = () => {
		let nonEdit = {}
		if (this.props.editable === false) {
			nonEdit.disableUnderline = true;
			nonEdit.IconComponent = "div";
		}
		return <FormControl fullWidth>
			{this.props.label && <InputLabel disabled>{this.props.label}</InputLabel>}
			<Select
				multiple={this.props.multiple}
				fullWidth
				disabled={this.props.disabled}
				value={this.props.value}
				onChange={(event) => this.props.onChange(event.target.value)}
				{...nonEdit}
				renderValue={value => this.getOptionsLabel(value)}
			>
				{this.renderMenuItems()}
			</Select>
			{this.props.editable === false && this.getCurtain()}
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
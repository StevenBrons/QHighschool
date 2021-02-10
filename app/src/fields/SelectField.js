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
		const normOptions = SelectField.getNormalizedOptions(nextProps.options);
		const containsCurValue = normOptions.filter(({ value }) => value === nextProps.value).length > 0;
		if (!containsCurValue && nextProps.freeSolo) {
			normOptions.push({
				label: nextProps.value,
				value: nextProps.value
			});
		}
		return {
			...prevState,
			options: normOptions,
			value: nextProps.value || "",
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

	renderValue = (val) => {
		let vs = this.props.multiple ? val : [val];
		return vs.map((v) => {
			const opt = this.state.options.filter(({ value }) => value === v)
			if (opt.length > 0) {
				if (opt[0].category) {
					return <div key={opt[0].value}>
						<Typography {...this.props.typograpyProps} variant="subtitle2">{opt[0].category}</Typography>
						<Typography {...this.props.typograpyProps}>{opt[0].label}</Typography>
					</div>
				} else {
					return opt[0].label;
				}
			} else {
				return val;
			}
		});
	}

	getOptionsLabel = (val) => {
		let vs = this.props.multiple ? val : [val];
		return vs.map((v) => {
			const opt = this.state.options.filter(({ value }) => value === v)
			if (opt.length > 0) {
				if (opt[0].category) {
					return opt[0].label
				} else {
					return opt[0].label;
				}
			} else {
				return "";
			}
		}).join(", ");
	}

	getCategoryOf = (val) => {
		return this.state.options.find(({ value }) => value === val).category
	}

	getAutocomplete = () => {
		return <Autocomplete
			value={this.state.value}
			disabled={this.props.disabled}
			freeSolo={this.props.freeSolo}
			autoSelect
			groupBy={this.getCategoryOf}
			options={this.state.options.map(({ label, value }) => value)}
			getOptionLabel={this.getOptionsLabel}
			onChange={(event, value) => this.props.onChange(value)}
			renderInput={(params) => <TextField {...params} label={this.props.label} variant="outlined" />}
		/>
	}

	getCurtain = () => {
		return <div style={{ width: "100%", height: "100%", position: "absolute", zIndex: 10 }} />
	}

	renderMenuItems = () => {
		if (this.props.children == null) {
			const items = this.state.options.reduce((acc, cur) => {
				const last = acc[acc.length - 1];
				if ((cur.category != null && last == null) || (last != null && last.category !== cur.category)) {
					return acc.concat([{ sep: true, category: cur.category, value: cur.value }, cur])
				}
				return acc.concat([cur]);
			}, [])
			return items.map(({ sep, label, value, category }) => {
				if (sep) {
					return <ListSubheader key={value + "_category"}>{category}</ListSubheader>;
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
				value={this.state.value}
				onChange={(event) => this.props.onChange(event.target.value)}
				{...nonEdit}
				renderValue={value => this.renderValue(value)}
			>
				{this.renderMenuItems()}
			</Select>
			{this.props.editable === false && this.getCurtain()}
		</FormControl >
	}

	render() {
		let field;
		if (this.state.options.length > 10 && !this.props.multiple && this.props.editable) {
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
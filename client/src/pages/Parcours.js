import React, { Component } from "react";
import Page from "./Page";
import { Typography, Toolbar, Paper, Divider} from '@material-ui/core';
import Field from "../components/Field";
import CheckIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";

const modules = [
	"module1","module2","module3","module4","module5","module6",
]

const PTA = {
	T01: ["module1","module2","module3"],
	T02: ["module3","module4","module5"],
	T03: ["module5","module6"],
}

class Parcours extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fields: {
				T01: null,
				T02: null,
				T03: null,
			},
			freeModules: [...modules],
			accepted: false,
		}
	}

	moveToField = (field,value) => {
		let fields = this.state.fields;
		let freeModules = this.state.freeModules;
		for (let _field in fields ) {
			if ( _field !== field && fields[_field] === value ) { // if module originated from field, clear that field
				fields[_field] = null;
			}
		}
		let index = freeModules.indexOf(value);
		if ( index !== -1 ){ // if module is in freeModules, remove it from there
			freeModules.splice(index,1);
		}
		if ( fields[field] != null ) { // if it already contains a module
			freeModules.push(fields[field]);
			freeModules.sort();
		}
		fields[field] = value;

		this.setState({
			fields:fields,
			freeModules: freeModules,
		})
	}

	moveToFree = (module) => {
		let fields = this.state.fields;
		for (let field in fields) {
			if (fields[field] === module ) {
				fields[field] = null;
				break;
			} 
		}
		this.setState({
			fields: fields,
			freeModules: [...this.state.freeModules, module].sort(),
		})
	}

	parcoursAccepted = () => {
		const fields = this.state.fields;
		for (let field in fields) {
			if (!( this.moduleAcceptedByPTA(fields[field], field) && this.moduleNotDouble(fields[field], field)) || fields[field] == null) {
				return false;
			}
		}
		return true;
	}

	moduleAcceptedByPTA = (module,field) => {
		return ( PTA[field].includes(module))
	}

	moduleNotDouble = (module,field) => {
		return (Object.keys(this.state.fields).reduce((acc, value) => {return acc && ( value === field || this.state.fields[value] !== module )}, true));
		// test if this module is not in another field
	}

	colorOption = (module,field) => {
		return this.moduleAcceptedByPTA(module,field) ? this.moduleNotDouble(module,field)? "" : "orange" : "red";
	}

	render() {
		return (
			<Page>
				<Paper elevation={2} style={{ position: "relative" }}>
					<Toolbar style={{ display: "flex" }}>
						<Typography variant="subheading" color="textSecondary" style={{ flex: "2 1 auto" }}>
							Parcours
						</Typography>
					</Toolbar>
				</Paper>
				<div>
					{Object.keys(PTA).map((field) => 
						<Field key={field} 
								label={field} 
								value={this.state.fields[field]} 
								options={modules.map(module => {
									return {label: module, value: module, style:{backgroundColor:this.colorOption(module,field)}};
								})}
								editable 
								onChange={value=> this.moveToField(field,value)}/>
					)}
					{
						this.parcoursAccepted() ? <CheckIcon style={{margin:"20px", color:"green"}}/> : <ErrorIcon style={{margin:"20px", color:"orange"}}/>
					}
				</div>

				<Divider />
				<div style={{display:"flex"}}>
					{Object.keys(PTA).map((field) =>
						<div onDragOver={this.onDragOver} 
							onDrop={e => this.onDrop(e, field)}
							key={field} 
							style={{height:"300px", width:"220px", margin:"10px", borderRadius:"10px", border:"1px dashed "+ this.colorOption(this.state.fields[field],field)}}>
								<h1>{field}</h1>
								{
									this.state.fields[field] &&
									<MovableModule module={this.state.fields[field]}/>
								}
							</div>
					)}
					{
						this.parcoursAccepted() ? <CheckIcon style={{margin:"20px", color:"green"}}/> : <ErrorIcon style={{margin:"20px", color:"orange"}}/>
					}
				</div>
				<Divider />
				<div style={{display:"flex"}}
					onDragOver={this.onDragOver}
					onDrop={e => this.onDrop(e,"free")}>
				{
					this.state.freeModules.map((module => { return (<MovableModule key={module} module={module}/>);})) }
				</div>
			</Page>
		)
	}

	onDragOver = event => {
		event.preventDefault();
	}

	onDrop = (event,field) => {
		let module = event.dataTransfer.getData("text");
		if (field === "free") {
			this.moveToFree(module);
		} else {
			this.moveToField(field,module);
		}
	}
}

class MovableModule extends Component {

	onDragStart = (event,module) => {
		event.dataTransfer.setData("text/plain", module);
	}
	
	render() {
		let module = this.props.module;
		return (
			<Paper 
				draggable onDragStart={e => this.onDragStart(e,module)} 
				elevation={3} 
				style={{height:"200px", width:"200px", margin:"10px", cursor: "move"}}>
				<h2 style={{margin:"10px"}}>
					{module}
				</h2>
			</Paper>
		);
	}
}

export default Parcours;
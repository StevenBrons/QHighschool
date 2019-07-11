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
			accepted: false,
		}
	}

	onChange = (field,value) => {
		this.setState({
			fields:{
				...this.state.fields,
				[field]: value,
			},
		})
	}

	parcoursAccepted = () => {
		const fields = this.state.fields;
		for (let field in fields) {
			if (!( this.moduleAcceptedByPTA(fields[field], field) && this.moduleNotDouble(fields[field], field)) || fields[field] == null) {
				console.log(fields[field] + " is not accepted at place " + field );
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

	render() {
		console.log(this.state);
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
									let style = this.moduleAcceptedByPTA(module,field) ? this.moduleNotDouble(module,field)? {} : {backgroundColor:"orange"} : {backgroundColor:"red"};
									return {label: module, value: module, style:style};
								})}
								editable 
								onChange={value=> this.onChange(field,value)}/>
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
							style={{height:"200px", width:"200px", margin:"10px", borderRadius:"10px", border:"1px dashed black"}}>
								<h1>{field}</h1>
								<h3>{this.state.fields[field]}</h3>
							</div>
					)}
					{
						this.parcoursAccepted() ? <CheckIcon style={{margin:"20px", color:"green"}}/> : <ErrorIcon style={{margin:"20px", color:"orange"}}/>
					}
				</div>
				<Divider />
				<div style={{display:"flex"}}>
				{
					modules.map((module => { return (
						<Paper key={module} draggable onDragStart={e => this.onDragStart(e,module)} elevation={3} style={{height:"200px", width:"200px", margin:"10px"}}>
							<h2 style={{margin:"10px"}}>{module}</h2>
						</Paper>
					)}))
				}
				</div>
			</Page>
		)
	}

	onDragOver = event => {
		event.preventDefault();
	}

	onDragStart = (event,module) => {
		event.dataTransfer.setData("text/plain", module);
	}
	
	onDrop = (event,field) => {
		let module = event.dataTransfer.getData("text");
		this.setState({
			fields:{
				...this.state.fields,
				[field]:module
			},
		})
	}
}

export default Parcours
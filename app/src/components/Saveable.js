import React, { Component } from "react";
import { Button, Paper } from "@material-ui/core/";
import "./Saveable.css"

class Saveable extends Component {

	render() {
		return <div>
			{this.props.children}
			{this.props.hasChanged && <Paper className="SaveBanner">
				<Button color="primary" variant="outlined" onClick={this.props.onSave}>
					Opslaan
				</Button>
				<Button color="default" onClick={this.props.onSave}>
					Annuleren
				</Button>
			</Paper>}
		</div>
	}
}


export default Saveable;
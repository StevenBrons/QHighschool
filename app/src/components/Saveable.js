import React, { Component } from "react";
import { Button, Paper } from "@material-ui/core/";
import EnsureSecureLogin from "../components/EnsureSecureLogin";
import "./Saveable.css"

class Saveable extends Component {

	render() {
		const onSave = this.props.onSave;
		const hasChanged = this.props.hasChanged;
		const editIfSecure = this.props.editIfSecure;
		const isSecure = this.props.isSecure;
		const showBanner = hasChanged || (editIfSecure && !isSecure);
		return <div>
			{this.props.children}
			{showBanner &&
				<Paper className="SaveBanner">
					{(editIfSecure && !isSecure) &&
						<EnsureSecureLogin dense>
							<br />
						</EnsureSecureLogin>
					}
					{hasChanged &&
						<div>
							<Button color="primary" variant="outlined" onClick={onSave}>
								Opslaan
							</Button>
							<Button color="default" onClick={onSave}>
								Annuleren
							</Button>
						</div>
					}
				</Paper>
			}
		</div>
	}
}


export default Saveable;
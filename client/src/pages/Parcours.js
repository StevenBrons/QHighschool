import React, { Component } from "react";
import Page from "./Page";
import Field from '../components/Field';
import { Typography, Toolbar, Paper} from '@material-ui/core';

class Parcours extends Component {
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
			</Page>
		)
	}
}

export default Parcours
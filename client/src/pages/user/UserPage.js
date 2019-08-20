import React, { Component } from 'react';
import Page from '../Page';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { setUser, isUserMissingInfo } from '../../store/actions';
import Field from '../../components/Field';
import Typography from '@material-ui/core/Typography';

const profiles = ["NT", "NG", "CM", "EM", "NT&NG", "EM&CM"];
const levels = ["VWO", "HAVO"];

class UserPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: this.props.user,
		};
	}

	handleChange = (name, value) => {
		this.setState({
			user: {
				...this.state.user,
				[name]: value,
			}
		});
	}

	hasChanged() {
		return JSON.stringify(this.props.user) !== JSON.stringify(this.state.user)
	}

	render() {
		let user = null;
		if (this.props.user.id !== this.state.user.id) {
			this.setState({
				user: this.props.user,
			});
			user = this.props.user;
		} else {
			user = this.state.user;
		}
		const shouldFillIn = this.props.ownProfile && (isUserMissingInfo(user) !== false);
		return (
			<Page>
				<Field
					label="Naam"
					value={user.displayName}
					style={{ type: "headline" }}
				/>
				<Field
					label="Rol"
					layout={{ alignment: "right" }}
					value={user.role}
				/>
				<Divider />
				<br />
				<div style={{ display: "flex" }} >
					<Field
						label="Leerjaar"
						value={user.year}
						style={{ margin: "normal" }}
						editable={this.props.ownProfile}
						onChange={(value) => this.handleChange("year", value)}
						validate={{
							type: "integer",
							min: 1,
							max: 6,
						}}
					/>
					<Field
						label="Opleidingsniveau"
						value={user.level}
						editable={this.props.ownProfile}
						onChange={(value) => this.handleChange("level", value)}
						options={levels}
						validate={{ notEmpty: true, }}
					/>
					{this.props.ownProfile &&
						<Field
							label="Profiel"
							value={user.profile}
							editable={this.props.ownProfile}
							options={profiles}
							onChange={(value) => this.handleChange("profile", value)}
							validate={{ notEmpty: true }}
						/>}
				</div>
				<div style={{ display: "flex" }} >
					{this.props.ownProfile && <Field
						label="Voorkeurs email"
						value={user.preferedEmail}
						editable={this.props.ownProfile}
						onChange={(value) => this.handleChange("preferedEmail", value)}
						validate={{ type: "email" }}
					/>}
					{this.props.ownProfile && <Field
						label="Telefoonnummer"
						value={user.phoneNumber}
						editable={this.props.ownProfile}
						onChange={(value) => this.handleChange("phoneNumber", value)}
						validate={{ type: "phoneNumber" }}
					/>}
				</div>
				<br />
				{
					shouldFillIn &&
					<Typography gutterBottom variant="button" color="secondary" >
						Controleer de bovenstaande gegevens en vul de ontbrekende gegevens aan.
					</Typography>
				}
				<br />
				<br />
				{
					this.hasChanged() &&
					<Button variant="contained" color="secondary" size="large" onClick={() => this.props.save(this.state.user)}>
						Opslaan
					</Button>
				}
			</Page >
		);
	}
}


function mapDispatchToProps(dispatch) {
	return {
		save: (user) => dispatch(setUser(user)),
	};
}


export default connect(null, mapDispatchToProps)(UserPage);


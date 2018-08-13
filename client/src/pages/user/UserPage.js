import React,{Component} from 'react';
import Page from '../Page';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { setUser } from '../../store/actions';
import Field from '../../components/Field';
import Typography from '@material-ui/core/Typography';

const profiles = ["NT", "NG", "CM", "EM", "NT&NG", "EM&CM"];

class UserPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: this.props.user,
		};
	}

	handleChange(event) {
		this.setState({
			user: {
				...this.state.user,
				[event.name]: event.target.value,
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
		let shouldFillIn = this.props.ownProfile && (
			this.props.user.profile == null ||
			this.props.user.profile === "" ||
			this.props.user.preferedEmail == null ||
			this.props.user.preferedEmail === "")?true:null;
		return (
			<Page>
				<Field label="Naam" value={user.displayName} headline editable={false} />
				<Divider />
				<br />
				<div style={{ display: "flex" }} >
					<Field label="Rol" value={user.role} editable={false} />
					<Field label="Leerjaar" value={user.year} editable={false} />
					<Field label="Niveau" value={user.level} editable={false} />
				</div>
				{this.props.ownProfile &&
					<div style={{ display: "flex" }} >
						<Field label="Voorkeurs email" name="preferedEmail" value={user.preferedEmail} editable={this.props.ownProfile} onChange={this.handleChange.bind(this)} />
						<Field label="Telefoonnummer" name="phoneNumber" value={user.phoneNumber} editable={this.props.ownProfile} onChange={this.handleChange.bind(this)} />
						<Field label="Profiel" name="profile" value={user.profile} editable={this.props.ownProfile} options={profiles} onChange={this.handleChange.bind(this)} />
					</div>
				}
				<br />
				{
					shouldFillIn &&
						<Typography gutterBottom variant="title" color="primary" >
							Controlleer de bovenstaande gegevens en vul de ontbrekende gegevens aan
						</Typography>
				}
				{
					this.hasChanged() ?
						<Button variant="contained" color="secondary" size="large" onClick={() => this.props.save(this.state.user)}>
							Opslaan
						</Button> : null
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


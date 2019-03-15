import React ,{ Component } from "react";
import { connect } from "react-redux";
import {Typography, Tooltip, TableSortLabel, Paper} from '@material-ui/core';
import User from "./User";
import Progress from '../../components/Progress'

class UserList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            hover:false,
            style: {
				width: "100%",
				height: "auto",
				margin: "0px",
                padding: "10px",
                backgroundColor:"#e0e0e0",
			},
        }
    }

    getHeader = () => {
        let style = {...this.state.style};
        console.log(style);
        let sortValue = "Naam";
        let sortDirection = "asc";
        return (
			<tr>
				<Paper
					elevation={this.state.hover ? 2 : 1}
					onMouseEnter={() => this.setState({ hover: true })}
					onMouseLeave={() => this.setState({ hover: false })}
					component="td"
					style={style}
				>
					<div style={{
						display: "flex",
						justifyContent: "space-between"
					}}>
						<Typography variant="title" color="primary" style={{ flex: 1}} >
							<Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                <TableSortLabel active={sortValue === "name"}
                  direction={sortDirection}
                  onClick={() => this.props.onSortChange("name")}
                  style={{color:"inherit"}} >
                  Naam
                </TableSortLabel>
              </Tooltip>
						</Typography>
						<Typography variant="subheading" style={{ flex: 1 }} >
              <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                <TableSortLabel active={sortValue === "school"}
                  direction={sortDirection}
                  onClick={() => this.props.onSortChange("school")} >
                  School 
                </TableSortLabel>
              </Tooltip>
						</Typography>
						<Typography variant="body1" style={{ flex: 1 }} >
              <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                <TableSortLabel active={sortValue === "levelAndYear"}
                  direction={sortDirection}
                  onClick={() => this.props.onSortChange("levelAndYear")} >
                  Niveau - Leerjaar 
                </TableSortLabel>
              </Tooltip>
						</Typography>
						<Typography variant="body1" style={{ flex: 1 }} >
              <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                <TableSortLabel active={sortValue === "role"}
                  direction={sortDirection}
                  onClick={() => this.props.onSortChange("role")} >
                  Rol
                </TableSortLabel>
              </Tooltip>
						</Typography>
						<Typography variant="body1" style={{ flex: 1 }} >
              <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                <TableSortLabel active={sortValue === "profile"}
                  direction={sortDirection}
                  onClick={() => this.props.onSortChange("profile")} >
                  Profiel 
                </TableSortLabel>
              </Tooltip>
						</Typography>
					</div>
					{this.props.role === "admin" &&
						<div style={{
							display: "flex",
							justifyContent: "space-between"
						}}>
							<Typography variant="body1" style={{ flex: 1 }} >
                <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                  <TableSortLabel active={sortValue === "email"}
                    direction={sortDirection}
                    onClick={() => this.props.onSortChange("email")} >
                    Office Email
                  </TableSortLabel>
                </Tooltip>
							</Typography>
							<Typography variant="body1" style={{ flex: 1 }} >
                <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                  <TableSortLabel active={sortValue === "preferedEmail"}
                    direction={sortDirection}
                    onClick={() => this.props.onSortChange("preferedEmail")} >
                    Voorkeurs email 
                  </TableSortLabel>
                </Tooltip>
							</Typography>
							<div style={{ flex: 1 }} />
							<Typography variant="body1" style={{ flex: 1 }} >
                <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                  <TableSortLabel active={sortValue === "phoneNumber"}
                    direction={sortDirection}
                    onClick={() => this.props.onSortChange("phoneNumber")} >
                    Telefoonnummer
                  </TableSortLabel>
                </Tooltip>
							</Typography>
							<Typography variant="body1" style={{ flex: 1 }} >
                <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
                  <TableSortLabel active={sortValue === "id"}
                    direction={sortDirection}
                    onClick={() => this.props.onSortChange("id")} >
                    Gebruikers ID
                  </TableSortLabel>
                </Tooltip>
							</Typography>
						</div>
					}
				</Paper >
			</tr>
        )
    }

    getUserRows = () => {
        const userIds = this.props.userIds;
        console.log(userIds);
        if ( userIds == null ){
            return <Progress/>;
        }
        return (
            userIds.map(id => {
                return <User key={id} userId={id} display="row" />
            })
        )
    }

	sort = () => {
		const value = this.props.sortValue;
		const direction = this.props.sortDirection;
        const users = this.props.users;
        const userIds = this.props.userIds;
		userIds.sort((a,b) => {
			switch(value) {
				case "name":
					a = (users[a]["firstName"] + users[a]["lastName"]).toLowerCase();
					b = (users[b]["firstName"] + users[b]["lastName"]).toLowerCase()
					break;
				case "levelAndYear":
					a = (users[a]["level"] + users[a]["year"]).toString();// to string because otherwise no level and year would result in a being an integer
					b = (users[b]["level"] + users[b]["year"]).toString();
					break;
				default:
					a = users[a][value];
					b = users[b][value];
			}
			let cmp = (a===null || a===undefined)-(b===null || b===undefined) || +(a>b)||-(a<b);
			return direction === "asc"? cmp : -cmp;
		})
		this.setState({
			userIds: userIds,
		})
	}

    render() {
    const header = this.getHeader();
    const users = this.getUserRows();
    console.log(this.props.userIds);
        return (
            <table style={{width:"100%"}}>
                <tbody>
                    {header}
                    {users}
                </tbody>
            </table>
        )
    }
}

function mapStateToProps(state, ownProps) {
	return{
        users: state.users,
        role: state.role,
	};
}

export default connect(mapStateToProps)(UserList);
import React, { Component } from "react";
import Badge from "@material-ui/core/Badge";
import { connect } from 'react-redux';
import theme from "../lib/MuiTheme";
import { withStyles, Tooltip } from "@material-ui/core";

const style = {
    colorPrimary:{
        backgroundColor: theme.palette.primary.main
    },
    colorSecondary: {
        backgroundColor: "#ff8c00"
    },
    colorError: {
        backgroundColor: theme.palette.error.main
    }
}

class NotificationBadge extends Component {


    render() {
        const notifications = this.props.notifications;
        const classes = this.props.classes;
        let color = "primary";
        let tooltipMessage = notifications.length > 0 ? notifications[0].message : "";
        for ( let i = 0; i < notifications.length; i ++ ) { 
            if (notifications[i].priority === "medium" || notifications[i].priority === "high" ){
                color="secondary";
                tooltipMessage=notifications[i].message;
                for ( let j = i ; j < notifications.length; j++ ) {
                    if ( notifications[j].priority === "high" ) {
                        color = "error"
                        tooltipMessage = notifications[j].message;
                        break;
                    }
                }
                break
            }
        }// tooltip is first message of highest priority
        //color is highest priority

        return (
            <Tooltip title={tooltipMessage} >
                <Badge badgeContent={notifications.length} classes={classes} color={color} >
                    {this.props.children}
                </Badge>
            </Tooltip>
        );
    }
}

function mapStateToProps(state, ownProps) {
	let notifications = state.notifications.filter((not) => {
		try {
            return not.type === "badge" && RegExp(not.scope).test(ownProps.scope);
		} catch (err) {
			return true;
		}
    });
	return {
		notifications: notifications,
	};
}

export default withStyles(style)(connect(mapStateToProps,null)(NotificationBadge));
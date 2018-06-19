import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import { Redirect, withRouter } from 'react-router-dom';

class Menu extends Component {

    onClick(page) {
        this.props.history.push("/" + page);
    }

    render() {
        var pages = this.props.pages.map((page) => {

            let style = {};
            if (page.bottom) {
                style.position = "absolute";
                style.bottom = "0px";
            }

            if (page.notifications > 0) {
                return (
                    <ListItem button onClick={() => this.onClick(page.id)} style={style}>
                        <ListItemIcon>
                            <Badge badgeContent={this.props.notifications} color="primary">
                                <InboxIcon />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary={page.title} />
                    </ListItem>
                );
            } else {
                return (
                    <ListItem button onClick={() => this.onClick(page.id)} style={style}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary={page.title} />
                    </ListItem>
                );
            }
        });
        return (
            <Paper elevation={8} className="Menu">
                <List component="nav" style={{ height: "100%" }}>
                    {pages}
                </List>
            </Paper >
        );
    }
}

export default withRouter(Menu);


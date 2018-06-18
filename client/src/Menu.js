import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';

class Menu extends Component {
    render() {
        let Inbox;
        if (this.props.notifications === 0) {
            Inbox = (
                <InboxIcon />
            );
        }else {
            Inbox = (
                <Badge badgeContent={this.props.notifications} color="primary">
                    <InboxIcon />
                </Badge>
            )
        }

        return (
            <Paper elevation={8} className="Menu">
                <List component="nav">
                    <ListItem button>
                        <ListItemIcon>
                            {Inbox}
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Drafts" />
                    </ListItem>
                </List>
            </Paper>
        );
    }
}

export default Menu;


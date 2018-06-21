import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

class Header extends Component {
    render() {
        return (
            <AppBar className="Header">
                <Toolbar>
                    <IconButton color="inherit" aria-label="Menu" onClick={this.props.handleShowMenu}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="!title" color="inherit">
                        Q-Highschool
                    </Typography>
                    <Button color="inherit" style={{right:10,position:"absolute"}}>{this.props.email}</Button>
                </Toolbar>
            </AppBar>
        );
    }
}

export default Header;


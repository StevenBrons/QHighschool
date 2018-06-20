import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import {withRouter} from 'react-router-dom';

class Login extends Component {

    login(event) {
        event.preventDefault();
        setCookie("token","token1",365);
        this.props.history.push("/");
    }

    render() {
        return (
            <Paper className="Login" elevation={8}>
                <form onSubmit={this.login.bind(this)}>
                    <TextField
                        name="email"
                        id="email"
                        label="Email"
                        margin="normal"
                        fullWidth
                    />
                    <br />
                    <TextField
                        name="password"
                        id="password"
                        label="Password"
                        margin="normal"
                        type="password"
                        fullWidth
                    />
                    <br />
                    <Button type="submit" variant="contained">
                        Login
                    </Button>
                </form>
            </Paper>
        );
    }
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export default withRouter(Login);

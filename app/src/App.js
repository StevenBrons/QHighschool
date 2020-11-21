import React, { Component } from "react";
import { Redirect, Route, Switch, withRouter, } from 'react-router-dom';
import { connect } from 'react-redux';

import { addNotification, getSelf } from './store/actions';

import Login from "./pages/Login";
import CourseSelect from "./pages/CourseSelect";
import Group from "./pages/group/Group";
import DataPage from "./pages/DataPage";
import Taxi from "./pages/Taxi";

import Header from "./components/Header";
import NotificationBar from "./components/NotificationBar";
import Menu from "./components/Menu";
import Portfolio from "./pages/Portfolio";
import ControlPanel from "./pages/ControlPanel";
import Profile from "./pages/profile/Profile";
import Certificate from "./pages/Certificate";
import UserListPage from "./pages/user/UserListPage";


class App extends Component {

    componentDidMount() {
        this.props.getSelf();
    }

    componentDidUpdate() {
        if (this.props.user != null && this.props.user.needsProfileUpdate && this.props.role === "student" && this.props.location.pathname !== "/profiel") {
            this.props.history.push("/profiel");
        }
    }

    handleShowMenu() {
        let showMenu = this.state.showMenu;
        this.setState({
            showMenu: !showMenu,
        });
    }

    getStartPage(role) {
        switch (role) {
            case "student":
                return "/aanbod";
            case "grade_admin":
                return "/gegevens";
            default:
                return "/groepen";
        }
    }

    render() {
        if (!this.props.role && this.props.location.pathname !== "/login") {
            return <div />;
        }
        const startPage = this.getStartPage(this.props.role);
        return (
            <div className="App">
                <NotificationBar />
                {this.props.showMenu && <Menu />}
                <Header />
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/aanbod" component={CourseSelect} />
                    <Route path="/groep/:groupId" component={Group} />
                    <Route path="/gebruikers" component={UserListPage} />
                    <Route path="/gebruiker/:userId" component={Profile} />
                    <Route path="/profiel/" component={Profile} />
                    <Route path="/portfolio/" component={Portfolio} />
                    <Route path="/groepen/" component={Portfolio} />
                    <Route path="/gegevens/" component={DataPage} />
                    <Route path="/taxi/" component={Taxi} />
                    <Route path="/beheer/" component={ControlPanel} />
                    <Route path="/certificaat/gebruiker/:userId/groep/:groupId" component={Certificate} />
                    <Route path="/certificaat/gebruiker/:userId/parcours/:subjectId" component={Certificate} />
                    <Redirect push to={startPage} />
                </Switch>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        showMenu: state.showMenu,
        userId: state.userId,
        role: state.role,
        user: state.userId ? state.users[state.userId] : null,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getSelf: () => dispatch(getSelf()),
        addNotification: (notification) => dispatch(addNotification(notification)),
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

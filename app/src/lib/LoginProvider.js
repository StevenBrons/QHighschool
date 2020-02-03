import { Component } from "react";
import queryString from "query-string";
import { withRouter } from 'react-router-dom';
import { setSecureLogin, getCookie } from "../store/actions"
import { connect } from "react-redux";

class LoginProvider extends Component {

	constructor(props) {
		super(props);
		this.state = {}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let s = queryString.parse(nextProps.location.search);
		if (s.secureLogin != null) {
			nextProps.setSecureLogin(s.secureLogin);
		}
		if (s.from === "login" && nextProps.user != null && nextProps.role !== "student") {
			const beforeLoginPath = getCookie("beforeLoginPath");
			nextProps.history.push(beforeLoginPath);
		}
		return prevState;
	}

	render() {
		return this.props.children;
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setSecureLogin: (secureLogin) => dispatch(setSecureLogin(secureLogin)),
	};
}


export default withRouter(connect(null, mapDispatchToProps)(LoginProvider));
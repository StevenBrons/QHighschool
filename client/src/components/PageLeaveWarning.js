import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';

class PageLeaveWarning extends Component {

	render() {
		const message = "Weet je zeker dat u de pagina wilt verlaten? Er zijn nog niet-opgeslagen gegevens!";
		if (this.props.giveWarning) {
			window.onbeforeunload = function (e) {
				e.returnValue = message;
				return message;
			};
		} else {
			window.onbeforeunload = null;
		}
		return (
			<Prompt
				when={this.props.giveWarning}
				message={location => message}
			/>
		);
	}

}

export default PageLeaveWarning;
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from './Page';

class MyGroups extends Component {

	render() {
		return (
			<Page>
				
			</Page>
		);
	}
}

function mapStateToProps(state) {
	return {
	};
}

function mapDispatchToProps(dispatch) {
	return {
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MyGroups);



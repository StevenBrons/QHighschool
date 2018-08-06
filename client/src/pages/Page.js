import React, { Component } from 'react';
import { connect } from 'react-redux';

class Page extends Component {

	render() {
		let style = {};
		if (!this.props.showMenu) {
			const startRow = 2;
			const endRow = 16;
			const startCol = 3;
			const endCol = 16;
			style = {
				"grid-column": startCol + " / " + endCol,
				"grid-row": startRow + " / " + endRow,
				"-ms-grid-column": startCol,
				"-ms-grid-column-span": endCol - startCol,
				"-ms-grid-row": startRow,
				"-ms-grid-row-span": endRow - startRow,
			}
		} else {
			const startRow = 2;
			const endRow = 16;
			const startCol = 3;
			const endCol = 16;
			style = {
				"grid-column": startCol + " / " + endCol,
				"grid-row": startRow + " / " + endRow,
				"-ms-grid-column": startCol,
				"-ms-grid-column-span": endCol - startCol,
				"-ms-grid-row": startRow,
				"-ms-grid-row-span": endRow - startRow,
			}
		}
		return (
			<div className="Page" style={style}>
				{this.props.children}
			</div>
		);
	}

}


function mapStateToProps(state) {
	return {
		showMenu: state.showMenu,
	};
}

export default Page;

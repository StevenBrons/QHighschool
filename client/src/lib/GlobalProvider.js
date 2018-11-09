import React, { Component } from "react";

import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import theme from './MuiTheme';
import App from '../App';

class GlobalProvider extends Component {
	render() {
		return (
			<Provider store={this.props.store}>
				<MuiThemeProvider theme={theme}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</MuiThemeProvider>
			</Provider>
		);
	}
}

export default GlobalProvider;
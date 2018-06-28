import React, { Component } from "react";
import ReactDOM from 'react-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#5472d3',
			main: '#0d47a1',
			dark: '#002171',
			contrastText: '#fff',
		},
		secondary: {
			light: '#60ad5e',
			main: '#2e7d32',
			dark: '#005005',
			contrastText: '#ffffff',
		},
	},
});

class GlobalProvider extends Component {
	render() {
		return (
			<div>
				<Provider store={this.props.store}>
					<MuiThemeProvider theme={theme}>
						<BrowserRouter>
							<App />
						</BrowserRouter>
					</MuiThemeProvider>
				</Provider>
			</div>
		);
	}
}

export default GlobalProvider;
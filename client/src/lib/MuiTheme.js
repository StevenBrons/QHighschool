import {createMuiTheme} from '@material-ui/core/styles';

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

export default theme;
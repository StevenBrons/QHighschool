import 'react-app-polyfill/ie11';
import smoothscroll from 'smoothscroll-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Page from './Page';
import './index.css';
require('typeface-roboto');
smoothscroll.polyfill();

ReactDOM.render(<Page />, document.getElementById('root'));

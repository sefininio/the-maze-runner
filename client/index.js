import React from 'react';
import ReactDOM from 'react-dom';

import Homepage from './pages/Homepage';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './index.css';

import App from './App';

const render = Comp => {
	return (
		<Comp/>
	);
};

ReactDOM.render(render(App), document.getElementById('app'));

if (module.hot) {
	module.hot.accept();
}
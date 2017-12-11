import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom';

import Homepage from "./pages/Homepage";
import Candidator from "./pages/Candidator";

const App = (props) => {
	return (
		<div>
			<h1>Welcome</h1>
			<Router>
				<div>
					<Route exact path="/" component={Homepage}/>
					<Route path="/candidator" component={Candidator}/>
				</div>
			</Router>
		</div>
	)
};

export default App;
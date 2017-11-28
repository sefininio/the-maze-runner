import React  from 'react';
import createReactClass from 'create-react-class';

import Login from '../components/Login';

// import './style.css';

const Homepage = createReactClass({
	render() {
		return (
			<div className="homepage">
				<Login/>
			</div>
		)
	}
});

export default Homepage;

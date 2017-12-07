import React  from 'react';
import createReactClass from 'create-react-class';

import Login from '../components/Login';

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

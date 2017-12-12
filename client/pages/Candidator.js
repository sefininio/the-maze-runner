import React from 'react';
// import './index.css';
import Question from './../components/Question/Question';
import axios from 'axios';

class Candidator extends React.Component {
	constructor() {
		super();
	}

	componentWillMount() {
		//TODO - make an API call to the server to get the questions from the questionPool
	}

	render() {
		return (
			<div>
				<Question/>
			</div>
		)
	}
}

export default Candidator;
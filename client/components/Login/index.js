import React, { Component } from 'react';
import {
	Jumbotron,
	Row,
	Col
} from 'reactstrap';

import Timi from '../Timi';
import './style.scss';

class Login extends Component {

	componentDidMount() {
		$(window.document.getElementById('terminal')).bgTerminal({
			url: '/api/v1/candidator/text/index',
			glow: true,
			speed: 50,
			wait: 300
		});
	}

	render() {
		return (<div className="content login">
			<div id="terminal" />
			<Timi />

			<Jumbotron className="text-center">
				<Row>
					<Col sm="12"><h1>Welcome to the Maze Runner</h1></Col>
				</Row>
				<Row>
					<Col sm="12"><h2>Are you brave enough to travel around the maze...?</h2></Col>
				</Row>

				<Row className="top-scores">
					<h3>Top Players:</h3>
					<div id="top-score-1" className="top-score">
						1. <i id="top-score-1-spinner" className="fa fa-spinner fa-spin" aria-hidden="true" />
					</div>
					<div id="top-score-2" className="top-score">
						2. <i id="top-score-2-spinner" className="fa fa-spinner fa-spin" aria-hidden="true" />
					</div>
					<div id="top-score-3" className="top-score">
						3. <i id="top-score-3-spinner" className="fa fa-spinner fa-spin" aria-hidden="true" />
					</div>
					<div id="top-score-4" className="top-score">
						4. <i id="top-score-4-spinner" className="fa fa-spinner fa-spin" aria-hidden="true" />
					</div>
					<div id="top-score-5" className="top-score">
						5. <i id="top-score-5-spinner" className="fa fa-spinner fa-spin" aria-hidden="true" />
					</div>
				</Row>

				<Row>
					<Col sm="12"><h4>Login or Register with:</h4></Col>
					<Col sm="12">
						<a href="/api/v1/user/auth/google" className="btn btn-normal"><i className="fa fa-google-plus" aria-hidden="true" /> Google</a>
						<a href="/api/v1/user/auth/facebook" className="btn btn-normal"><i className="fa fa-facebook" aria-hidden="true" /> Facebook</a>
						<a href="/api/v1/user/auth/github" className="btn btn-normal"><i className="fa fa-github" aria-hidden="true" /> Github</a>
					</Col>
				</Row>
			</Jumbotron>

		</div>);
	}
}

export default Login;
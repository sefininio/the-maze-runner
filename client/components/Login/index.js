import React, { Component } from 'react';
import {
	Jumbotron,
	Row
} from 'reactstrap';
import Timi from '../Timi';
import './style.css';

class Login extends Component {

	render() {
		return (<div className="content login">
			<div id="terminal" />
			<Timi />

			<Jumbotron className="text-center">
				<Row>
					<h1>Welcome to the Maze Runner</h1>
				</Row>

				<Row>
					<h2>Are you brave enough to travel around the maze...?</h2>
				</Row>

				<Row className="top-scores text-center">
					<h3>Top Players:</h3>
					<div id="top-score-1">
						1. <i id="top-score-1-spinner" className="fa fa-spinner fa-spin" aria-hidden="true" />
					</div>
					<div id="top-score-2">
						2. <i id="top-score-2-spinner" className="fa fa-spinner fa-spin" aria-hidden="true" />
					</div>
					<div id="top-score-3">
						3.<i id="top-score-3-spinner" className="fa fa-spinner fa-spin" aria-hidden="true" />
					</div>
					<div id="top-score-4">
						4. <i id="top-score-4-spinner" className="fa fa-spinner fa-spin" aria-hidden="true" />
					</div>
					<div id="top-score-5">
						5. <i id="top-score-5-spinner" className="fa fa-spinner fa-spin" aria-hidden="true" />
					</div>
				</Row>

				<Row>
					<h4>Login or Register with:</h4>
					<a href="/auth/google" className="btn btn-normal"><i className="fa fa-google-plus" aria-hidden="true" /> Google</a>
					<a href="/auth/facebook" className="btn btn-normal"><i className="fa fa-facebook" aria-hidden="true" /> Facebook</a>
					<a href="/auth/github" className="btn btn-normal"><i className="fa fa-github" aria-hidden="true" /> Github</a>
				</Row>
			</Jumbotron>
		</div>);
	}
}

export default Login;
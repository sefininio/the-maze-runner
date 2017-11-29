import React, { Component } from 'react';
import axios from 'axios';

import './style.scss';

class Start extends Component {

	constructor(props) {
		super(props);

		this.state = {
			timiText: ''
		};
	}

	componentDidMount() {
		$(window.document.getElementById('terminal')).bgTerminal({
			url: '/api/v1/candidator/text/start',
			glow: true,
			speed: 50,
			wait: 300
		});

		this.implementJS();
	}

	implementJS() {
		const head = document.getElementsByTagName('head')[0];
		let script = document.createElement('script');

		script.type = 'text/javascript';
		script.text = 'function aMazeMe() {$.ajax("/api/v1/candidator/start-clue").then(function(res) {console.log(`I guess the room name ends with: ${res}`);});}';

		head.appendChild(script);
	}

	timiClick() {
		if (this.state.timiText.length === 0) {
			axios.get('/api/v1/candidator/timi').then(this.updateTimi.bind(this));
		}
	}

	updateTimi(text) {
		this.setState({timiText: text.data});
	};

	render() {
		return (<div className="content start">
			<div id="terminal" />
			<div className="timi" onClick={this.timiClick.bind(this)} />
			{this.state.timiText.length > 0 && <div className="timi-text">Timi says: {this.state.timiText}</div>}
		</div>);
	}
}

export default Start;
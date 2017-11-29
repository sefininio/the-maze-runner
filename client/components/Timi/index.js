import React  from 'react';
import createReactClass from 'create-react-class';

import './style.scss';

const Timi = createReactClass({
	getInitialState: function() {
		return { isBlink: false };
	},

	componentDidMount: function() {
		this.timiBlink();
	},

	timiBlink() {
		this.setState({ isBlink: true });

		setTimeout(() => {
			this.setState({ isBlink: false })
		}, 200);

		setTimeout(this.timiBlink, this.getRandomTime());
	},

	getRandomTime() {
		return Math.floor(Math.random() * 7000);
	},

	render() {
		return (
			<div className={`timi ${this.state.isBlink ? 'blink' : ''}`} />
		)
	}
});

export default Timi;
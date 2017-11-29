import React, { Component } from 'react';
import {
	Jumbotron,
	Row,
	Col
} from 'reactstrap';
import axios from 'axios';

import './style.scss';

class Welcome extends Component {

	constructor(props) {
		super(props);

		this.state = {
			mazeId: ''
		}
	}

	componentDidMount() {
		$(window.document.getElementById('terminal')).bgTerminal({
			url: '/text/welcome',
			glow: true,
			speed: 50,
			wait: 300
		});

		axios.get('/maze-id', this.updateId.bind(this));
	}

	updateId(id) {
		this.setState({mazeId: id});
	}

	render() {
		return (<div className="content welcome">
			<Jumbotron className="text-center">
				<Row className="text-center">
					<h1>Welcome Adventurer!</h1>
				</Row>
				<Row>
					<Col sm="12" className="documentation text-left">
						<h3>Description of the challenge</h3>

						<p>You have successfully navigated to the maze entrance.
							The task at hand, is to travel the maze created just for you!</p>

						<p>Each maze room will have a letter written on the wall. <br />
							You should implement an algorithm that traverses the maze, tracks the letters on the wall and figures
							out how those letters combine to a maze hash once you decide all rooms have been visited.</p>

						<h4>Quests</h4>
						<p>Some of the maze rooms will be part of a quest. Some quests span across a single room, while some
							span across multiple rooms. <br />In these rooms, the letter on the wall will only be revealed once
								you solve the room puzzle.</p>

						<h4>Solution</h4>
						<p>You should send your code along with the maze hash as the solution to <code>maze-runner@tikalk.com</code>. <br/>
							If you would like to join us at <a href="http://www.tikalk.com/" target="_blank">Tikal</a>, feel free to also send your CV!<br/>
							Once submitted, you will receive an email that the solution was received and under review.</p>

						<h4>Technology</h4>
						<p>The choice of technology stack is up to you: Frontend, Backend or <a href="https://www.meetup.com/full-stack-developer-il/" target="_blank">FullStack</a>.</p>

						<h4>Extra Credit</h4>
						<p>Draw the dungeon on screen!</p>
					</Col>
				</Row>

				<Col sm="12" className="documentation text-left">
					<h2>REST APIs</h2>
				</Col>

				<div>
					Your mazeId is: <code className="maze-id">{this.state.mazeId}</code>.
					You should use it when making API calls.
				</div>

				<div className="documentation text-left">
					<Row>

						<Col sm="12">
							<h4>/maze/:mazeId/describe</h4>
							<p>The result will be an object that contains the current room description.<br />
								The quest property will only appear if the room is part of a quest.
								Until the quest is complete, the hashLetter property will not be provided.</p>
							<label>Return</label>
							<code className="code-example">
								{`{
	description: {
		hashLetter: string,
		quest: {
			questId: string,
			itemId: string,
			pickedUpItem: boolean,
			description: string,
			action: string
		}
	}
}`}
							</code>
						</Col>

						<Col sm="12">
							<h4>/maze/:mazeId/beat-monster/:comeback</h4>
							<p>Some quests require beating a monster. It will throw an insult your way, and you
								will have to reply with a snappy comeback. Some monsters are harder to beat and will require
								more than just one snappy comeback! If you are successful, you will get the hashLetter.<br/>
									(See below for the API for getting an insult comeback).</p>
							<label>Return</label>
							<code className="code-example">
								{`{
	description: {
		hashLetter: string,
		quest: {
			questId: string,
			itemId: string,
			pickedUpItem: boolean,
			description: string,
			action: string
		}
	}
}`}
							</code>
						</Col>

						<Col sm="12">
							<h4>/maze/:mazeId/exits</h4>
							<p>The result will be an object that contains the possible exits from the current room.
								0 = N, 90 = E, 180 = S, 270 = W.</p>
							<label>Return</label>
							<code className="code-example">
								{`{
	exits: [0, 90, 180, 270]
}`}
							</code>
						</Col>

						<Col sm="12">
							<h4>/maze/:mazeId/exit/:direction</h4>
							<p>Given a <code>direction</code> to exit, the result will be the next roomId.</p>
							<label>Return</label>
							<code className="code-example">
								{`{
	newRoomId: string
}`}
							</code>
						</Col>

						<Col sm="12">
							<h4>/maze/:mazeId/reset</h4>
							<p>Will teleport you back to the first room. All quest items will be lost!</p>
							<label>Return</label>
							<code className="code-example">
								{`{
	currentRoomId: number
}`}
							</code>
						</Col>

						<Col sm="12">
							<h4>/maze/:mazeId/validate/:hash</h4>
							<p>Given the <code>hash</code>, the result will be if the hash is correct or not.
								<span className="note">Be careful! There is a limit to the number of times you can validate!</span></p>
							<label>Return</label>
							<code className="code-example">
								{`{
	validated: boolean
}`}
							</code>
						</Col>

						<Col sm="12">
							<h4>/insult/:insult</h4>
							<p>Given the <code>insult</code>, the result will the insult and its comeback.</p>
							<label>Return</label>
							<code className="code-example">
								{`{
	insult: string,
	comeback: string
}`}
							</code>
						</Col>

					</Row>
				</div>
			</Jumbotron>
		</div>);
	}
}

export default Welcome;
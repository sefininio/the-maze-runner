# MazeRunner
MazeRunner is Tikal's JS code challenge.

**_If you are joining the development effort on this project, please join the `#maze-runner` channel on `Slack` and enable all notifications._**

Candidates should write code that traverse the maze and figure out the maze hash.

Once the candidate logs into the system (with an email, using Passport) - the server will generate a maze for the
candidate and store it on a local DB (`nedb`), as well as the history of his server requests for future analysis when
reviewing the solution code.

In some of the maze rooms there will be a letter written on the wall.  
Further more, in some (or all) of the rooms there will be a monster to defeat. The combat is automatic and candidate always wins so there's no real battle here, but it will introduce a delay in each room (each monster can take a different time to beat). The purpose of this delay is to be able to measure candidate solution run time compared to optimum solution and thus measure candidate solution efficiency.

Candidate should implement code that will traverse the maze, track the letters on the wall and figure out how those letters combine to a maze hash.  
On the UI perspective, the code should draw the maze on screen as it is being discovered as well as log the monster kills and how long it took to defeat.  
The candidate should send his code and the hash as the solution.  
Once submitted, candidate will receive an email that the solution was received and under review, as well as send a notification to the review team via `Slack`.

The candidate can choose what to use to implement the code on the FrontEnd -  
* Using `ES5` or `ES6`  
* With a framework of choice - `Angular 1.x`, `Angular 2`, `React`, `Vue.js`  etc.  
* Using any JavaScript superset - `TypeScript`, `CoffeeScript` etc.  
* Draw the maze on screen using - `DOM manipulation`, `JQuery`, `svg.js` etc.


## Rest API:
* **start()**  
result will be an object that contains the first `roomId`. The adventure begins!  
```javascript
{
    roomId: string

}
```

* **getRoomExits(roomId)**  
given a `roomId`, the result will be an object that contains the array of one or more exit directions.  
```javascript
{
    exits: [S, W, N, E, SW, SE, NW, NE]

}
```

* **getWritingOnTheWall(roomId)**  
given a `roomId`, the result will be an object that contains the writing  
```javascript
{
    writing: string
    id: string
}
```
* **defeatMonster(roomId)**  
given a `roomId`, the result will be returned(void), but delayed by the monster delay period.

* **exitRoom(roomId, direction)**  
given a `roomId` and the `direction` to exit, the result will be the next `roomId`.  
```javascript
{
    roomId: string
}
```

* **checkMazeHash(hash)**  
given the `hash`, the result will be if it is correct or not.  
```javascript
{
    correct: boolean
}
```

## Using Docker

Requirements: docker installed on localhost

1. Clone this repo

```
git clone <this repo>
```

2. Create the oauth.js file in the .dev directory [ note on what should be in it ?]
```
mkdir .dev
```

3. Build Docker Container from Docekrfile

```
cd maze-runner
docker build -t <yourname>/maze-runner .
```

4. Run Docker Container as daemon
```
docker run -d -p 3000:3000 <yourname>/maze-runner
```

5. visit the app at `http://localhost:3000`

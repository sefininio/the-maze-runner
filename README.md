# MazeRunner
MazeRunner is Tikal's JS code challenge.

**_If you are joining the development effort on this project, please join the `#maze-runner` channel on `Slack` and enable all notifications._**

####Authentication
Authentication is done over `Passport.js` (currently supporting Google, Facebook and Github).

####Purpose
Once a Challenger logs into the system, the server will generate a random dungeon for the Challenger and store it 
on a local DB (`nedb`).

Each dungeon room will have a letter written on the wall.  
Challengers should implement an algorithm that traverses the dungeon, track the letters on the wall and figure out how those letters combine to a dungeon hash.  

####Quests
Some of the rooms will be part of a quest.  
Some quests span across a single room, while some span across multiple rooms.  
In these rooms, the letter on the wall will only be revealed once you solve the room puzzle.  

####Solution
The Challenger should send his code and the dungeon hash as the solution.  
Once submitted, Challenger will receive an email that the solution was received and under review.

####Technology
The Challenger can choose the technology used to implement the code.  

FrontEnd  
* Using `ES5` or `ES6`  
* With a framework of choice - `Angular 1.x`, `Angular 2`, `React`, `Vue.js`  etc.  
* Using any JavaScript superset - `TypeScript`, `CoffeeScript` etc.  
* Draw the dungeon on screen using - `DOM manipulation`, `JQuery`, `svg.js` etc.

Backend 
* JavaScript
* Java
* Python
* Ruby
* etc.


## Rest API:
* **/generate**  
Result will be an object that contains the first `roomId`. The adventure begins!  
```javascript
{
    firstRoomId: string
}
```

* **/room/:roomId/describe**  
Given a `roomId`, the result will be an object that contains the room description.  
The quest property will only appear if the room is part of a quest.  
Until the quest is complete, the hashLetter property will not be provided.  
_You can only do this operation if you are currently inside the `roomId`._  
```javascript
{
    description: {
        hashLetter: string,
        quest: {
            questId: string,
            itemId: string,
            description: string
        }
    }
}
```
* **/room/:roomId/exits**  
Given a `roomId`, the result will be an object that contains the possible exits from the room.  
0 = N, 90 = E, 180 = S, 270 = W  
_You can only do this operation if you are currently inside the `roomId`._  
```javascript
{
    exits: [0, 90, 180, 270]
}
```
* **/room/:roomId/exit/:direction**  
Given a `roomId` and the `direction` to exit, the result will be the next `roomId`.  
_You can only do this operation if you are currently inside the `roomId`._  
```javascript
{
    newRoomId: string
}
```

* **/validate/:hash**  
Given the `hash`, the result will be if the hash is correct or not.  
_Be careful! There is a limit to the number of times you can validate!_ 
```javascript
{
    validated: boolean
}
```

## Using Docker

Requirements: docker installed on localhost

1. Clone this repo

```
git clone <this repo>
```

2. Create the oauth.js file in the conf directory
oauth.js is a configuration file for social login. It should be in the format: 
```
    google: {
        "client_id": "",
        "client_secret": "",
        "redirect_uri":""
    },
    facebook: {
        "client_id": "",
        "client_secret": "",
        "redirect_uri": ""
    },
    github: {
        "client_id": "",
        "client_secret": "",
        "redirect_uri": ""
    }

```
Please contact repo owner for the maze-runner app oauth.js file.

```
mkdir conf
```

3. Build Docker Container from Dockerfile

```
cd maze-runner
docker build -t <yourname>/maze-runner .
```

4. Run Docker Container as daemon
```
docker run -d -p 3000:3000 <yourname>/maze-runner
```

5. visit the app at `http://localhost:3000`

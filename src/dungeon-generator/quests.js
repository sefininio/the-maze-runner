const questsObj = {
	"quests": [
		{
			"questId": 0,
			"itemId": 1,
			"startOfQuest": true,
			"endOfQuest": false,
			"desc": "You see a ladder in the corner of the room.",
			"action": "You pick up the ladder."
		},
		{
			"questId": 0,
			"itemId": 2,
			"prereqObj": {
				"prereqId": 1
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "Hmm.. There's a key on the ceiling",
			"actionPrereqNotMet": "If only there was a way up there...",
			"action": "You use the ladder to pick up the key!"
		},
		{
			"questId": 0,
			"itemId": 3,
			"prereqObj": {
				"prereqId": 2
			},
			"startOfQuest": false,
			"endOfQuest": true,
			"desc": "A chest! Damn, it's locked...",
			"actionPrereqNotMet": "You hear a loud voice booming: 'No Lock picking!!!'",
			"action": "You use the key and unlock the chest!"
		},
		{
			"questId": 1,
			"itemId": 4,
			"startOfQuest": true,
			"endOfQuest": false,
			"desc": "Wow! a Phoenix Feather Holly wand just lying here on the floor!",
			"action": "You pick up the wand"
		},
		{
			"questId": 1,
			"itemId": 5,
			"prereqObj": {
				"prereqId": 4
			},
			"startOfQuest": false,
			"endOfQuest": true,
			"desc": "Aaahhhh!! A snake!",
			"actionPrereqNotMet": "Your scar starts to hurt.",
			"action": "You zap Voldermort with your wand!"
		},
		{
			"questId": 2,
			"itemId": 6,
			"startOfQuest": true,
			"endOfQuest": true,
			"desc": "You find a note on the floor, but it is in a strange language. Your head gets dizzy... ",
			"action": "<!!! Action should be changed in gen code !!!>",
			"encoding": "base64"
		},
		{
			"questId": 3,
			"itemId": 7,
			"startOfQuest": true,
			"endOfQuest": true,
			"desc": "You find a note on the floor, but it is in a strange language. Your head gets dizzy... ",
			"action": "<!!! Action should be changed in gen code !!!>",
			"encoding": "utf16le"
		},
		{
			"questId": 4,
			"itemId": 8,
			"prereqObj": {
				"minUniqueRoomsVisited": 300
			},
			"startOfQuest": true,
			"endOfQuest": true,
			"desc": "You see Albus Dumbledore sitting on the floor. You ask for the secret. ",
			"actionPrereqNotMet": "'You still know nothing! Come back later.' he says.",
			"action": "You are indeed knowledgeable in the ways of the maze!"
		},
		{
			"questId": 5,
			"itemId": 11,
			"startOfQuest": true,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>"
		},
		{
			"questId": 5,
			"itemId": 12,
			"prereqObj": {
				"prereqId": 11
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 13,
			"prereqObj": {
				"prereqId": 12
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 14,
			"prereqObj": {
				"prereqId": 13
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 15,
			"prereqObj": {
				"prereqId": 14
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 16,
			"prereqObj": {
				"prereqId": 15
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 17,
			"prereqObj": {
				"prereqId": 16
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 18,
			"prereqObj": {
				"prereqId": 17
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 19,
			"prereqObj": {
				"prereqId": 18
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 20,
			"prereqObj": {
				"prereqId": 19
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 21,
			"prereqObj": {
				"prereqId": 20
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 22,
			"prereqObj": {
				"prereqId": 21
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 23,
			"prereqObj": {
				"prereqId": 22
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 24,
			"prereqObj": {
				"prereqId": 23
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 25,
			"prereqObj": {
				"prereqId": 24
			},
			"startOfQuest": false,
			"endOfQuest": false,
			"desc": "You see a monster! it spits an insult your way! You should reply with a snappy comeback...",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "<!!! prereq room should be changed in gen code !!!>",
		},
		{
			"questId": 5,
			"itemId": 26,
			"prereqObj": {
				"prereqId": 25
			},
			"startOfQuest": false,
			"endOfQuest": true,
			"desc": "You see the Insults Queen! You must beat her with the comebacks you have learned!",
			"action": "<!!! insult should be changed in gen code !!!>",
			"actionPrereqNotMet": "Ha! You challenge me? Go learn more insults first!",
		},

	]
};

module.exports = {
	quests: questsObj.quests
};
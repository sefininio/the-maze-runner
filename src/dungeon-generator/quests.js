const questsObj = {
    "quests": [
        {
            "questId": 0,
            "itemId": 1,
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
            "endOfQuest": true,
            "desc": "A chest! Damn, it's locked...",
            "actionPrereqNotMet": "You hear a loud voice booming: 'No Lock picking!!!'",
            "action": "You use the key and unlock the chest!"
        },
        {
            "questId": 1,
            "itemId": 4,
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
            "endOfQuest": true,
            "desc": "Aaahhhh!! A snake!",
            "actionPrereqNotMet": "Your scar starts to hurt.",
            "action": "You zap Voldermort with your wand!"
        },
        {
            "questId": 2,
            "itemId": 6,
            "endOfQuest": true,
            "desc": "You find a note on the floor, but it is in a strange language. Your head gets dizzy... ",
            "action": "<!!! Action should be changed in gen code !!!>",
            "encoding": "base64"
        },
        {
            "questId": 3,
            "itemId": 7,
            "endOfQuest": true,
            "desc": "You find a note on the floor, but it is in a strange language. Your head gets dizzy... ",
            "action": "<!!! Action should be changed in gen code !!!>",
            "encoding": "utf16le"
        },
        {
            "questId": 4,
            "itemId": 8,
            "prereqObj": {
                "minUniqueRoomsVisited": 30
            },
            "endOfQuest": true,
            "desc": "You see Albus Dumbledore sitting on the floor. You ask for the secret. ",
            "actionPrereqNotMet": "'You still know nothing! Come back later.' he says.",
            "action": "You are indeed knowledgeable in the ways of the maze!"
        }
    ]
};

module.exports = {
    quests: questsObj.quests
};
const TOP = 0;
const RIGHT = 90;
const BOTTOM = 180;
const LEFT = 270;

module.exports = {
    QUESTS: {
        INSULT_QUEST: 5,
    },
    TIME_LIMIT: 86400000,
    TOP: TOP,
    BOTTOM: BOTTOM,
    LEFT: LEFT,
    RIGHT: RIGHT,
    FACING: [TOP, RIGHT, BOTTOM, LEFT],
    FACING_TO_STRING: {
        [TOP]: 'top',
        [RIGHT]: 'right',
        [BOTTOM]: 'bottom',
        [LEFT]: 'left',
    },
    FACING_TO_MOD: {
        [TOP]: [0, -1],
        [RIGHT]: [1, 0],
        [BOTTOM]: [0, 1],
        [LEFT]: [-1, 0],
    },
    FACING_INVERSE: {
        [TOP]: BOTTOM,
        [RIGHT]: LEFT,
        [BOTTOM]: TOP,
        [LEFT]: RIGHT,
    },
    FACING_MOD_RIGHT: {
        [TOP]: RIGHT,
        [RIGHT]: BOTTOM,
        [BOTTOM]: LEFT,
        [LEFT]: TOP,
    },
    FACING_MOD_LEFT: {
        [TOP]: LEFT,
        [RIGHT]: TOP,
        [BOTTOM]: RIGHT,
        [LEFT]: BOTTOM,
    },
};

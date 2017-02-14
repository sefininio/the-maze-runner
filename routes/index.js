const express = require('express');
const router = express.Router();
const Dungeon = require('../src/dungeon-generator/');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});


router.get('/generate', (req, res) => {
    let dungeon = new Dungeon();

    res.send(dungeon.generate().persist());
});

module.exports = router;

const express = require('express');
const router = express.Router();
const cors = require('cors');

module.exports = () => {
    router.get('/questions', cors(), (req, res) => {
        res.send([
            {
                description: 'question1',
                heroImage: 'http://www.dccomics.com/sites/default/files/GalleryChar_1920x1080_BM_Cv38_54b5d0d1ada864.04916624.jpg',
            }
        ]);
    });

    return router;
};

const express = require('express');

const router = express.Router();
const controller = require('../controllers/logs');
const database = require('../config/database');
const { check, validationResult } = require('express-validator');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'main';
    next();
});

router.route('/')
    .get(controller.index);

router.route('/search')
    .post(controller.submitUsername);

router.route('/search/:username')
    .get(controller.searchUsername);



module.exports = router;
const express = require('express');

const router = express.Router();
const controller = require('../controllers/hiscores');

//Verify user is logged in
const { is_login } = require('../middleware/authenticate');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'main';
    next();
});




module.exports = router;
const express = require('express');

const router = express.Router();
const controller = require('../controllers/store');

//Verify user is logged in
const { is_login } = require('../middleware/authenticate');

router.all('/*', is_login, (req, res, next) => {
    req.app.locals.layout = 'main';
    next();
});



module.exports = router;
const express = require('express');

const router = express.Router();
const controller = require('../controllers/homepage');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'main';
    next();
});

router.route('/')
    .get(controller.index);

router.route('/login')
    .get(controller.login)
    .post(controller.loginSubmit);

router.route('/register')
    .get(controller.register)
    .post(controller.registerSubmit);

router.route('/logout')
    .get(controller.logout);

router.route('/404')
    .get(controller.fourohfour);

module.exports = router;
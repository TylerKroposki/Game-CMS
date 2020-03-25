const express = require('express');

const router = express.Router();
const controller = require('../controllers/hiscores');

//Verify user is logged in
const { is_login } = require('../middleware/authenticate');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'main';
    next();
});

router.route('/')
    .get(controller.index);

router.route('/p/:page')
    .get(controller.regularGetPage);

router.route('/s/:id/p/:page')
    .get(controller.getRegSkillPage);

router.route('/ironman')
    .get(controller.ironmanIndex);

router.route('/ironman/p/:page')
    .get(controller.ironmanPage);

router.route('/ironman/s/:id/p/:page')
    .get(controller.ironmanSkillPage);

router.route('/hcim')
    .get(controller.hcimIndex);

router.route('/hcim/p/:page')
    .get(controller.hcimPage);

router.route('/hcim/s/:id/p/:page')
    .get(controller.hcimSkillPage);




module.exports = router;
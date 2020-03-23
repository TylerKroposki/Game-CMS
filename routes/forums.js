const express = require('express');

const router = express.Router();
const controller = require('../controllers/forums');

//Verify user is logged in
const { is_login } = require('../middleware/authenticate');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'main';
    next();
});

router.route('/')
    .get(controller.index);

//Get forum and display
router.route('/f/:id')
    .get(controller.getForum);

//Get thread and display
router.route('/t/:id')
    .get(controller.getThread)
    .post(controller.submitThreadReply);


module.exports = router;